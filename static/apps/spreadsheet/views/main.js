define(["jquery",
        "marionette",
        "underscore",
        "handlebars",
        "views/media_browser",
        "models/record",
        "models/marker",
        "collections/photos",
        "apps/spreadsheet/views/create-field",
        "handsontable",
        "text!../templates/spreadsheet.html",
        "lib/audio/audio-player",
        "lib/carousel/carousel"
    ],
    function ($, Marionette, _, Handlebars, MediaBrowser,
        Record, Marker, Photos, CreateFieldView, Handsontable, SpreadsheetTemplate,
        AudioPlayer, Carousel) {
        'use strict';
        var Spreadsheet = Marionette.ItemView.extend({
            template: function () {
                return Handlebars.compile(SpreadsheetTemplate);
            },
            table: null,
            className: 'main-panel',
            currentModel: null,
            show_hide_deleteColumn: true,
            events: {
                'click #addColumn': 'showCreateFieldForm',
                'click .addMedia': 'showMediaBrowser',
                'click .delete_column' : 'deleteField',
                'click .carousel-photo': 'carouselPhoto',
                'click .carousel-audio': 'carouselAudio',
                'click .carousel-video': 'carouselVideo'
            },
            foo: "bar",
            initialize: function (opts) {
                _.extend(this, opts);

                // call Marionette's default functionality (similar to "super")
                Marionette.ItemView.prototype.initialize.call(this);
                this.registerRatingEditor();
                this.render();
                //listen to events that fire from other parts of the application:
                this.listenTo(this.app.vent, 'search-requested', this.doSearch);
                this.listenTo(this.app.vent, 'clear-search', this.clearSearch);
                this.listenTo(this.app.vent, "render-spreadsheet", this.renderSpreadsheet);
                this.listenTo(this.app.vent, "add-row", this.addRow);
                this.listenTo(this.app.vent, 'add-models-to-marker', this.attachModels);
                if (this.collection) {
                    this.listenTo(this.collection, 'reset', this.renderSpreadsheet);
                    this.listenTo(this.collection, 'add', this.renderSpreadsheet);
                }
                if (this.fields) {
                    this.listenTo(this.fields, 'reset', this.renderSpreadsheet);
                }
            },
            registerRatingEditor: function () {
                // following this tutorial: https://docs.handsontable.com/0.15.0-beta1/tutorial-cell-editor.html
                var SelectRatingsEditor = Handsontable.editors.SelectEditor.prototype.extend(),
                    that = this;
                SelectRatingsEditor.prototype.prepare = function () {
                    var me = this, selectOptions, i, option, optionElement;
                    Handsontable.editors.SelectEditor.prototype.prepare.apply(this, arguments);
                    selectOptions = this.cellProperties.selectOptions;
                    $(this.select).empty();
                    optionElement = document.createElement('OPTION');
                    optionElement.value = "";
                    optionElement.innerHTML = "-- Select --";
                    this.select.appendChild(optionElement);
                    for (i = 0; i < selectOptions.length; i++) {
                        option = selectOptions[i];
                        optionElement = document.createElement('OPTION');
                        optionElement.value = option.value;
                        optionElement.innerHTML = option.value + ": " + option.name;
                        if (option.value == this.originalValue) {
                            optionElement.selected = true;
                        }
                        this.select.appendChild(optionElement);
                    }
                    //this is a hack b/c the renderer isn't being called correctly:
                    $(this.select).blur(function () {
                        setTimeout(function () {
                            that.table.setDataAtCell(me.row, me.col, me.getValue());
                        }, 50);
                    });
                };
                SelectRatingsEditor.prototype.getValue = function () {
                    var val = this.select.value;
                    if (val === "") {
                        val = null;
                    }
                    return val;
                };
                Handsontable.editors.registerEditor('select-ratings', SelectRatingsEditor);
            },
            onRender: function () {
                this.renderSpreadsheet();
            },
            //
            // Arranging the columns
            // For now, I only want to arrange without any saving
            // for this current draft
            columnMoveBefore: function(col_indexes_to_be_moved, destination_index){
                var media_column_index = this.fields.length + 4; //change to whatever one is valid
                var pre_field_index = 2;
                if (col_indexes_to_be_moved.indexOf(media_column_index) != -1 || destination_index >= media_column_index) {
                    console.error('Cannot move your column behind the media column');
                    return false;
                } else if (col_indexes_to_be_moved.indexOf(pre_field_index) != -1 || destination_index <= pre_field_index){
                    console.error('Cannot move your column before the ID and lat/lng');
                    return false;
                }
            },

            columnMoveAfter: function(col_indexes_to_be_moved, destination_index){
                var media_column_index = this.fields.length + 4, //change to whatever one is valid
                    pre_field_index = 2,
                    i = 0,
                    currentOrdering,
                    oldPosition,
                    newPosition,
                    fieldIndex,
                    field;
                if (col_indexes_to_be_moved.indexOf(media_column_index) != -1 || destination_index >= media_column_index ||
                        col_indexes_to_be_moved.indexOf(pre_field_index) != -1 || destination_index <= pre_field_index) {
                    return false;
                }

                for (i = 0; i < col_indexes_to_be_moved.length; i++) {
                    fieldIndex = col_indexes_to_be_moved[i] - 3;
                    field = this.fields.at(fieldIndex);
                    oldPosition = field.get("ordering") + 2;
                    if (oldPosition < destination_index) {
                        --destination_index;
                    }
                    newPosition = destination_index - 2 + i;

                    field.set("ordering", newPosition);
                    field.save({"ordering": newPosition, do_reshuffle: 1}, { patch: true, wait: true });
                }
            },
            renderSpreadsheet: function () {
                // When the spreadsheet is made without a defined collection
                // Alert that there is no collection
                // for the sole purpose of unit testing

                if (!this.collection) {
                    this.$el.find('#grid').html("Collection is not defined");
                    return;
                }

                if (this.collection.length == 0) {
                    this.$el.find('#grid').html('<div class="empty-message">' +
                        'No ' + this.app.dataType + ' have been added yet.' +
                        '</div>');
                    return;
                }
                var grid = this.$el.find('#grid').get(0),
                    rowHeights = [],
                    i = 0,
                    data = [],
                    that = this;
                if (this.table) {
                    this.table.destroy();
                    this.table = null;
                }
                for (i = 0; i < this.collection.length; i++) {
                    rowHeights.push(55);
                }
                this.collection.each(function (model) {
                    var rec = model.toJSON();
                    if (rec.tags) {
                        rec.tags = rec.tags.join(", ");
                    }
                    data.push(rec);
                });
                this.table = new Handsontable(grid, {
                    data: data,
                    fixedRowsTop: 0,
                    colWidths: this.getColumnWidths(),
                    rowHeights: rowHeights,
                    colHeaders: this.getColumnHeaders(),
                    manualColumnResize: true,
                    manualColumnMove: (this.fields != null && this.fields != undefined),
                    rowHeaders: true,
                    columns: this.getColumns(),
                    maxRows: this.collection.length,
                    autoRowSize: true,
                    columnSorting: true,
                    undo: true,
                    afterChange: function (changes, source) {
                        that.saveChanges(changes, source);
                        if (changes && changes[0] && changes[0].length > 1 && changes[0][1] == "video_provider") {
                            that.table.render();
                        }
                    }
                });
                if (this.fields) {
                    this.table.addHook('beforeColumnMove', this.columnMoveBefore.bind(this));
                    this.table.addHook('afterColumnMove', this.columnMoveAfter.bind(this));
                }
            },
            saveChanges: function (changes, source) {
                var that = this;
                //sync with collection:
                source = source.split(".");
                source = source[source.length - 1];
                var i, idx, key, oldVal, newVal, model, geoJSON;
                if (_.contains(["edit", "autofill", "fill", "undo", "redo", "paste"], source)) {
                    for (i = 0; i < changes.length; i++) {
                        idx = changes[i][0];
                        key = changes[i][1];
                        oldVal = changes[i][2];
                        newVal = changes[i][3];
                        if (oldVal !== newVal) {
                            //Note: relies on the fact that the first column is the ID column
                            //      see the getColumns() function below
                            model = this.getModelFromCell(null, idx);
                            if (key === 'lat' || key === 'lng') {
                                //SV TODO: To handle polygons and polylines, only set latLng if current
                                //          geometry is null of of type "Point." Still TODO.
                                // Good article: https://handsontable.com/blog/articles/4-ways-to-handle-read-only-cells
                                model.set(key, newVal);
                                if (model.get("lat") && model.get("lng")) {
                                    geoJSON = model.setPointFromLatLng(model.get("lat"), model.get("lng"));
                                    model.save({ geometry: JSON.stringify(geoJSON) }, {patch: true, wait: true});
                                } else {
                                    model.set("geometry", null);
                                    if (!model.get("lat") && !model.get("lng")) {
                                        model.save({ geometry: null }, {patch: true, wait: true});
                                    }
                                }
                            } else {
                                model.set(key, newVal);
                                model.save(model.changedAttributes(), { patch: true, wait: true});
                            }
                        }
                    }
                }
            },
            getModelFromCell: function (table, index) {
                table = table || this.table;
                var modelID = table.getDataAtRowProp(index, "id");
                return this.collection.get(modelID);
            },
            thumbnailRenderer: function (instance, td, rowIndex, colIndex, prop, value, cellProperties) {
                var that = this,
                    img = document.createElement('IMG'),
                    model,
                    modalImg,
                    captionText,
                    modal,
                    span;
                img.src = value;
                img.onclick = function () {
                    model = that.getModelFromCell(instance, rowIndex);
                    // Get the modal
                    modal = document.getElementById('mediaModal');

                    // Get the image and insert it inside the modal - use its "alt" text as a caption
                    //var img = document.getElementById('myImg');
                    modalImg = document.getElementById("img01");
                    captionText = document.getElementById("caption");
                    modal.style.display = "block";
                    modalImg.src = model.get("path_medium");

                    // Get the <span> element that closes the modal
                    span = document.getElementsByClassName("close")[0];

                    // When the user clicks on <span> (x), close the modal
                    span.onclick = function () {
                        modal.style.display = "none";
                    };
                };
                Handsontable.Dom.empty(td);
                td.appendChild(img);
                return td;
            },
            audioRenderer: function (instance, td, rowIndex, colIndex, prop, value, cellProperties) {


                var audio_model = this.getModelFromCell(instance, rowIndex);

                var player = new AudioPlayer({
                    model: audio_model,
                    audioMode: "basic",
                    app: this.app
                });
                $(td).html(player.$el.addClass("spreadsheet"));
                return td;
            },


            videoRenderer: function (instance, td, rowIndex, colIndex, prop, value, cellProperties) {
                var that = this,
                    model = this.getModelFromCell(instance, rowIndex),
                    i = document.createElement('i');

                if (model.get('video_provider') === "vimeo") {
                    i.className = "fa fa-3x fa-vimeo";
                } else {
                    i.className = "fa fa-3x fa-youtube";
                }
                i.onclick = function () {
                    that.showVideoModal(model);
                };
                Handsontable.Dom.empty(td);
                td.appendChild(i);
                return td;
            },

            showVideoModal: function(model){
                var modal = document.getElementById("videoModal");
                var captionText = document.getElementById("caption");
                var videoFrame = document.getElementById("video-iframe");
                videoFrame.src = ""
                if (model.get("video_provider") == "vimeo"){
                    // Vimeo
                    videoFrame.src = "https://player.vimeo.com/video/" + model.get("video_id");
                } else {
                    // Youtube
                    videoFrame.src = "https://www.youtube.com/embed/" +
                    model.get("video_id") + "?ecver=1";
                }

                modal.style.display = "block";
            },

            mediaCountRenderer: function(instance, td, row, col, prop, value, cellProperties) {
                var model = this.getModelFromCell(instance, row),
                    photoCount = model.get("photo_count") || 0,
                    audioCount = model.get("audio_count") || 0,
                    videoCount = model.get("video_count") || 0,
                    i;
                //for whatever reason, the first row renders twice. Weird:
                //console.log("mediaCountRenderer:", model.id, photoCount, audioCount, videoCount);

                td.innerHTML = "<a class='fa fa-plus-square-o addMedia' aria-hidden='true' row-index = '"+row+"' col-index = '"+col+"'></a>";
                for (i = 0; i < photoCount; ++i) {
                    td.innerHTML += "<a class = 'carousel-photo' row-index = '"+row+"' col-index = '"+col+"'>\
                    <i class='fa fa-file-photo-o' aria-hidden='true' row-index = '"+row+"' col-index = '"+col+"'></i></a>";
                }
                for (i = 0; i < audioCount; ++i) {
                    td.innerHTML += "<a class = 'carousel-audio' row-index = '"+row+"' col-index = '"+col+"'>\
                    <i class='fa fa-file-audio-o' aria-hidden='true' row-index = '"+row+"' col-index = '"+col+"'></i></a>";
                }
                for (i = 0; i < videoCount; ++i) {
                    td.innerHTML += "<a class = 'carousel-video' row-index = '"+row+"' col-index = '"+col+"'>\
                    <i class='fa fa-file-video-o' aria-hidden='true' row-index = '"+row+"' col-index = '"+col+"'></i></a>";
                }

            },

            carouselPhoto: function(e){
                var that = this;
                var row_idx = $(e.target).attr("row-index");
                this.currentModel = this.collection.at(parseInt(row_idx));
                //any extra view logic. Carousel functionality goes here
                this.currentModel.fetch({success: function(){
                    console.log(new Photos(that.currentModel.get("children").photos));
                    var c = new Carousel({
                        model: that.currentModel,
                        mode: "photos",
                        app: that.app,
                        collection: new Photos(that.currentModel.get("children").photos.data)
                    });
                    console.log(c.$el);

                    $("#carouselModal").empty();
                    $("#carouselModal").append(c.$el);
                    var $span = $("<span class='close big'>&times;</span>");
                    $span.click(function () {
                        $("#carouselModal").hide();
                    })
                    $("#carouselModal").append($span);

                    // Get the modal
                    var modal = document.getElementById('carouselModal');
                    modal.style.display = "block";
                }});
            },

            carouselAudio: function(e){

                var that = this;

                var row_idx = $(e.target).attr("row-index");
                this.currentModel = this.collection.at(parseInt(row_idx));
                //any extra view logic. Carousel functionality goes here
                this.currentModel.fetch({success: function(){
                    var c = new Carousel({
                        model: that.currentModel,
                        mode: "audio",
                        app: that.app
                    });
                    //that.$el.find(".carousel").append(c.$el);

                    $("#carouselModal").empty();
                    $("#carouselModal").append(c.$el);
                    var $span = $("<span class='close big'>&times;</span>");
                    $span.click(function () {
                        $("#carouselModal").hide();
                        //document.getElementById("carouselModal").style.display='none';
                    })
                    $("#carouselModal").append($span);

                    // Get the modal
                    var modal = document.getElementById('carouselModal');

                    modal.style.display = "block";
                }});
            },



            carouselVideo: function(e){

                var that = this;

                var row_idx = $(e.target).attr("row-index");
                this.currentModel = this.collection.at(parseInt(row_idx));
                //any extra view logic. Carousel functionality goes here
                this.currentModel.fetch({success: function(){
                    var c = new Carousel({
                        model: that.currentModel,
                        mode: "videos",
                        app: that.app
                    });
                    //that.$el.find(".carousel").append(c.$el);

                    $("#carouselModal").empty();
                    $("#carouselModal").append(c.$el);
                    var $span = $("<span class='close big'>&times;</span>");
                    $span.click(function () {
                        $("#carouselModal").hide();
                        //document.getElementById("carouselModal").style.display='none';
                    })
                    $("#carouselModal").append($span);

                    // Get the modal
                    var modal = document.getElementById('carouselModal');

                    modal.style.display = "block";
                }});
            },

            buttonRenderer: function (instance, td, row, col, prop, value, cellProperties) {
                var button = document.createElement('BUTTON'),
                    that = this,
                    model;
                button.innerHTML = "<i class='fa fa-trash trash_button' aria-hidden='true'></i>";
                Handsontable.Dom.empty(td);
                td.appendChild(button);
                button.onclick = function () {
                    if (!confirm("Are you sure you want to delete this row?")) {
                        return;
                    }
                    // First grab the model of the target row to delete
                    model = that.getModelFromCell(instance, row);

                    // The model holding the row data is destroyed,
                    // but the row containing the data still appears
                    // inside the data from handsontable (H.O.T.)
                    model.destroy();

                    // We need to call instance, since it calls the data table
                    // from H.O.T. to easily alter the table
                    // by removing the target row
                    instance.alter("remove_row", row);

                    // Now there is no trace of any deleted data,
                    // especially when the user refreshes the page
                };
                return td;
            },

            ratingRenderer: function (instance, td, row, col, prop, value, cellProperties) {
                var that = this,
                    model = this.getModelFromCell(instance, row),
                    idx = col - 3,
                    field = this.fields.getModelByAttribute('col_name', prop),
                    extras = field.get("extras") || [],
                    intVal = model.get(prop),
                    textVal = null,
                    i;
                for (i = 0; i < extras.length; i++){
                    if (extras[i].value == intVal){
                        textVal = extras[i].value + ": " + extras[i].name;
                        break;
                    }
                }
                td.innerHTML = textVal;
                return td;
            },

            showMediaBrowser: function (e) {
                var row_idx = $(e.target).attr("row-index");
                this.currentModel = this.collection.at(parseInt(row_idx));
                var mediaBrowser = new MediaBrowser({
                    app: this.app
                });
                this.app.vent.trigger("show-modal", {
                    title: 'Media Browser',
                    width: 1100,
                    height: 400,
                    view: mediaBrowser,
                    saveButtonText: "Add",
                    showSaveButton: true,
                    saveFunction: mediaBrowser.addModels.bind(mediaBrowser)
                });
            },

            attachModels: function (models) {
                var that = this,
                    i = 0,
                    ordering;
                for (i = 0; i < models.length; i++) {
                    ordering = this.currentModel.get("photo_count") + this.currentModel.get("audio_count");
                    this.currentModel.attach(models[i], (ordering + i + 1), function () {
                        that.currentModel.fetch({
                            success: function(){
                                that.renderSpreadsheet();
                            }
                        });
                    }, function () {});
                }

                this.app.vent.trigger('hide-modal');
            },

            getColumnHeaders: function () {
                var cols;
                switch (this.collection.key) {
                    case "audio":
                        return ["ID", "Lat", "Lng", "Title", "Caption", "Audio", "Tags", "Attribution", "Owner", "Delete"];
                    case "photos":
                        return ["ID", "Lat", "Lng", "Title", "Caption", "Thumbnail", "Tags", "Attribution", "Owner", "Delete"];
                    case "videos":
                        return ["ID", "Lat", "Lng", "Title", "Caption", "Video", "Video ID", "Provider", "Tags", "Attribution", "Owner", "Delete"];
                    case "markers":
                        cols = ["ID", "Lat", "Lng", "Title", "Caption", "Tags", "Owner", "Media", "Delete"];
                        return cols;
                    default:
                        if (!this.fields){
                            return null;
                        }//*/
                        cols = ["ID", "Lat", "Lng"];

                        for (var i = 0; i < this.fields.length; ++i) {
                            var deleteColumn = this.show_hide_deleteColumn == true ? " <a class='fa fa-minus-circle delete_column' fieldIndex= '" +
                                                                              i +"' aria-hidden='true'></a>" : "";
                            cols.push(this.fields.at(i).get("col_name") + deleteColumn);
                        }
                        cols.push("Media");
                        cols.push("Delete");
                        cols.push("<a class='fa fa-plus-circle' id='addColumn' aria-hidden='true'></a>");
                        return cols;
                }
            },
            getColumnWidths: function () {
                switch(this.collection.key){
                    case "audio":
                        return [30, 80, 80, 200, 400, 300, 200, 100, 80, 100];
                    case "photos":
                        return [30, 80, 80, 200, 400, 65, 200, 100, 80, 100];
                    case "videos":
                        return [30, 80, 80, 200, 400, 65, 100, 100, 200, 100, 80, 100];
                    case "markers":
                        return [30, 80, 80, 200, 400, 200, 120, 100, 100];
                    default:
                        if (!this.fields){
                            return null;
                        }//*/
                        var cols = [30, 80, 80];
                        for (var i = 0; i < this.fields.length; ++i){
                            cols.push(150);
                        }
                        cols.push(120);
                        return cols;
                }
            },

            doSearch: function (term) {

                // If form exist, do search with 3 parameters, otherwise, do search with two parameters]
                if (this.collection.key.indexOf("form_")){
                    this.collection.doSearch(term, this.app.getProjectID(), this.fields);
                } else {
                    this.collection.doSearch(term, this.app.getProjectID());
                }

            },

            clearSearch: function () {
                this.collection.clearSearch(this.app.getProjectID());
            },

            getColumns: function () {
                switch (this.collection.key) {
                    case "audio":
                        return [
                            { data: "id", readOnly: true},
                            { data: "lat", type: "numeric", format: '0.00000' },
                            { data: "lng", type: "numeric", format: '0.00000' },
                            { data: "name", renderer: "html"},
                            { data: "caption", renderer: "html"},
                            { data: "file_path", renderer: this.audioRenderer.bind(this), readOnly: true, disableVisualSelection: true},
                            { data: "tags", renderer: "html" },
                            { data: "attribution", renderer: "html"},
                            { data: "owner", readOnly: true},
                            { data: "button", renderer: this.buttonRenderer.bind(this), readOnly: true, disableVisualSelection: true}
                        ];
                    case "photos":
                       return [
                            { data: "id", readOnly: true},
                            { data: "lat", type: "numeric", format: '0.00000' },
                            { data: "lng", type: "numeric", format: '0.00000' },
                            { data: "name", renderer: "html"},
                            { data: "caption", renderer: "html"},
                            { data: "path_marker_lg", renderer: this.thumbnailRenderer.bind(this), readOnly: true, disableVisualSelection: true},
                            { data: "tags", renderer: "html" },
                            { data: "attribution", renderer: "html"},
                            { data: "owner", readOnly: true},
                            { data: "button", renderer: this.buttonRenderer.bind(this), readOnly: true, disableVisualSelection: true}
                       ];
                   case "videos":
                      return [
                           { data: "id", readOnly: true},
                           { data: "lat", type: "numeric", format: '0.00000' },
                           { data: "lng", type: "numeric", format: '0.00000' },
                           { data: "name", renderer: "html"},
                           { data: "caption", renderer: "html"},
                           { data: "video_provider", renderer: this.videoRenderer.bind(this), readOnly: true, disableVisualSelection: true},
                           { data: "video_id", type: "text"},
                           { data: "video_provider", type: "text", editor: "select", selectOptions: ["vimeo", "youtube"]},
                           { data: "tags", renderer: "html" },
                           { data: "attribution", renderer: "html"},
                           { data: "owner", readOnly: true},
                           { data: "button", renderer: this.buttonRenderer.bind(this), readOnly: true, disableVisualSelection: true}
                      ];
                    case "markers":
                       return [
                            { data: "id", readOnly: true},
                            { data: "lat", type: "numeric", format: '0.00000' },
                            { data: "lng", type: "numeric", format: '0.00000' },
                            { data: "name", renderer: "html"},
                            { data: "caption", renderer: "html"},
                            { data: "tags", renderer: "html" },
                            { data: "owner", readOnly: true},
                            { data: "media", renderer: this.mediaCountRenderer.bind(this), readOnly: true, disableVisualSelection: true },
                            { data: "button", renderer: this.buttonRenderer.bind(this), readOnly: true, disableVisualSelection: true}
                       ];
                    default:
                        if (!this.fields){
                            return null;
                        }//*/
                        var cols = [
                            { data: "id", readOnly: true },
                            { data: "lat", type: "numeric", format: '0.00000' },
                            { data: "lng", type: "numeric", format: '0.00000' }
                        ];
                        for (var i = 0; i < this.fields.length; ++i){
                            // Make sure to add in the "-" symbol after field name to delete column
                            var type = this.fields.at(i).get("data_type").toLowerCase();
                            var field_format = "";
                            var field_dateFormat = "";
                            var field_correctFormat = false;
                            var renderer = null;
                            var editor = null;
                            var entry = null;
                            switch (type) {
                                case "boolean":
                                    entry = {
                                        type:  "checkbox"
                                    };
                                    break;
                                case "integer":
                                    entry = {
                                        type:  "numeric"
                                    };
                                    break;
                                case "decimal":
                                    entry = {
                                        type:  "numeric",
                                        format: "0,0.000"
                                    };
                                    break;
                                case "choice":
                                    var choiceOpts = [],
                                        j = 0,
                                        extras = this.fields.at(i).get("extras");
                                    for (j = 0; j < extras.length; j++) {
                                        choiceOpts.push(extras[j].name);
                                    }
                                    entry = {
                                        type:  "text",
                                        editor: "select",
                                        selectOptions: choiceOpts
                                    };
                                    break;
                                case "date-time":
                                    entry = {
                                        type:  "date",
                                        dateFormat: "YYYY-MM-DDThh:mm",
                                        correctFormat: true
                                    };
                                    break;
                                case "rating":
                                    entry = {
                                        type:  "numeric",
                                        editor: "select-ratings",
                                        renderer: this.ratingRenderer.bind(this),
                                        selectOptions: this.fields.at(i).get("extras") || []
                                    };
                                    break;
                                default:
                                    entry = {
                                        type:  "text"
                                    };
                            }
                            _.extend(entry, {
                                data: this.fields.at(i).get("col_name")
                            });
                            cols.push(entry);
                        };

                        cols.push(
                            { data: "media", renderer: this.mediaCountRenderer.bind(this), readOnly: true, disableVisualSelection: true }
                        );

                        cols.push(
                            {data: "button", renderer: this.buttonRenderer.bind(this), readOnly: true, disableVisualSelection: true }
                        );

                        cols.push(
                            {data: "addField", renderer: "html", readOnly: true, disableVisualSelection: true }
                        );
                        return cols;
                }
            },

            showCreateFieldForm: function () {
                // see the apps/gallery/views/toolbar-dataview.js function
                // to pass the appropriate arguments:
                var fieldView = new CreateFieldView({
                    formID: this.app.dataType.split("_")[1],
                    fields: this.fields,
                    app: this.app
                });
                this.app.vent.trigger('show-modal', {
                    title: "Create New Column",
                    view: fieldView,
                    saveFunction: fieldView.saveToDatabase,
                    width: 300,
                    height: 100
                });
            },

            deleteField: function (e) {
                //
                // You need to access the column that is being selected
                // Then re-order the columns so that the deleted column is last
                // Then after re-ordering the columns, then delete the selected column
                //
                var that = this;
                if (!confirm("Do you want to delete this field?")){
                    return;
                }

                e.preventDefault();
                var fieldIndex = $(e.currentTarget).attr("fieldIndex");
                var targetColumn = this.fields.at(fieldIndex);
                targetColumn.destroy({
                    success: function () {
                        that.renderSpreadsheet();
                    }
                });

            },
            addRow: function (dataType) {

                var that = this;
                var projectID = this.app.getProjectID();
                var rec;

                if (dataType == "markers"){
                    rec = new Marker({project_id: projectID});
                } else {
                    rec = new Record ({project_id: projectID});
                }

                rec.collection = this.collection;
                rec.save(null, {
                    success: function(){
                        // To add an empty column a the top, set the index to insert at 0
                        that.collection.add(rec, {at: 0});
                        that.renderSpreadsheet();
                    }
                });

            }

        });
        return Spreadsheet;
    });
