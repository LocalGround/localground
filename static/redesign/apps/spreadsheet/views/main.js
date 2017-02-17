define(["marionette",
        "underscore",
        "handlebars",
        "apps/gallery/views/media_browser",
        "models/record",
        "models/marker",
        "apps/spreadsheet/views/create-field",
        "handsontable",
        "text!../templates/spreadsheet.html",
        "lib/audio/audio-player",
        "lib/carousel/carousel"
    ],
    function (Marionette, _, Handlebars, MediaBrowser,
        Record, Marker, CreateFieldView, Handsontable, SpreadsheetTemplate,
        AudioPlayer, Carousel) {
        'use strict';
        var Spreadsheet = Marionette.ItemView.extend({
            template: function () {
                return Handlebars.compile(SpreadsheetTemplate);
            },
            table: null,
            currentModel :null,
            events: {
                'click #addColumn': 'showCreateFieldForm',
                'click .addMedia': 'showMediaBrowser',
                'click .delete_column' : 'deleteField',
                'click .carousel-photo': 'carouselPhoto',
                'click .carousel-audio': 'carouselAudio'
            },
            foo: "bar",
            initialize: function (opts) {
                _.extend(this, opts);

                // call Marionette's default functionality (similar to "super")
                Marionette.ItemView.prototype.initialize.call(this);
                this.render();

                //listen to events that fire from other parts of the application:
                this.listenTo(this.app.vent, 'search-requested', this.doSearch);
                this.listenTo(this.app.vent, 'clear-search', this.clearSearch);
                this.listenTo(this.app.vent, "render-spreadsheet", this.renderSpreadsheet);
                this.listenTo(this.app.vent, "add-row", this.addRow);
                this.listenTo(this.app.vent, 'add-models-to-marker', this.attachModels);
            },
            onRender: function () {
                this.renderSpreadsheet();
            },
            renderSpreadsheet: function () {
                if (this.collection.length == 0) {
                    this.$el.find('#grid').html("no rows found");
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
                    colWidths: this.getColumnWidths(),
                    rowHeights: rowHeights,
                    colHeaders: this.getColumnHeaders(),
                    manualColumnResize: true,
                    manualRowResize: true,
                    rowHeaders: true,
                    columns: this.getColumns(),
                    maxRows: this.collection.length,
                    autoRowSize: true,
                    columnSorting: true,
                    undo: true,
                    afterChange: function (changes, source) {
                        that.saveChanges(changes, source);
                    }
                });
            },
            saveChanges: function (changes, source) {
                //sync with collection:
                var i, idx, key, oldVal, newVal, model, geoJSON;
                if (_.contains(["edit", "autofill", "undo", "redo", "paste"], source)) {
                    for (i = 0; i < changes.length; i++) {
                        idx = changes[i][0];
                        key = changes[i][1];
                        oldVal = changes[i][2];
                        newVal = changes[i][3];
                        if (oldVal !== newVal) {
                            console.log("[" + source + "]: saving changes to database...");
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
                                        console.log("nulling...");
                                        model.save({ geometry: null }, {patch: true, wait: true});
                                    }
                                }
                            } else {
                                model.set(key, newVal);
                                model.save(model.changedAttributes(), {patch: true, wait: true});
                            }
                            console.log(model.changedAttributes());
                        } else {
                            console.log("[" + source + "], but no value change. Ignored.");
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
                    console.log(model);
                    // Get the modal
                    modal = document.getElementById('myModal');

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

                //
                //
                //
                var audio_model = this.getModelFromCell(instance, rowIndex);

                var player = new AudioPlayer({
                    model: audio_model,
                    audioMode: "basic",
                    app: this.app
                });
                $(td).append(player.$el.addClass("spreadsheet"));
                //*/
                return td;
            },

            photoCountRenderer: function (instance, td, row, col, prop, value, cellProperties) {
                var model = this.getModelFromCell(instance, row),
                    count = model.get("photo_count") || 0,
                    i;
                td.innerHTML = "<a class='fa fa-plus-square-o addMedia' aria-hidden='true' row-index = '"+row+"' col-index = '"+col+"'></a>";
                for (i = 0; i < count; ++i) {
                    td.innerHTML += "<a class = 'carousel-photo' row-index = '"+row+"' col-index = '"+col+"'>\
                    <i class='fa fa-file-photo-o' aria-hidden='true' row-index = '"+row+"' col-index = '"+col+"'></i></a>";
                }
                console.log(model + " row: " + row + ", column: " + col);
            },

            audioCountRenderer: function (instance, td, row, col, prop, value, cellProperties) {
                var model = this.getModelFromCell(instance, row),
                    count = model.get("audio_count") || 0,
                    i;
                td.innerHTML = "<a class='fa fa-plus-square-o addMedia' aria-hidden='true' row-index = '"+row+"' col-index = '"+col+"'></a>";
                for (i = 0; i < count; ++i) {
                    td.innerHTML += "<a class = 'carousel-audio' row-index = '"+row+"' col-index = '"+col+"'>\
                    <i class='fa fa-file-audio-o' aria-hidden='true' row-index = '"+row+"' col-index = '"+col+"'></i></a>";
                }
                console.log(model + " row: " + row + ", column: " + col);

            },

            carouselPhoto: function(e){

                var that = this;

                var row_idx = $(e.target).attr("row-index");
                console.log(e.target);
                console.log(row_idx);
                this.currentModel = this.collection.at(parseInt(row_idx));
                //any extra view logic. Carousel functionality goes here
                this.currentModel.fetch({success: function(){
                    console.log(that.currentModel);
                    var c = new Carousel({
                        model: that.currentModel,
                        app: that.app
                    });

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

                    console.log(c);
                }});
            },

            carouselAudio: function(e){

                var that = this;

                var row_idx = $(e.target).attr("row-index");
                //console.log(row_idx);
                this.currentModel = this.collection.at(parseInt(row_idx));
                //any extra view logic. Carousel functionality goes here
                this.currentModel.fetch({success: function(){
                    var c = new Carousel({
                        model: that.currentModel,
                        app: that.app
                    });
                    that.$el.find(".carousel").append(c.$el);
                    console.log(c);
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
            /*
            * While the media browser itself does work as intended,
            * The save button itself does not add files to
            * the affected row.
            *
            * Will have to add in code that will target the selected row
            * to add in new photos and audio
            */
            showMediaBrowser: function (e) {
                var row_idx = $(e.target).attr("row-index");
                //console.log(row_idx);
                this.currentModel = this.collection.at(parseInt(row_idx));
                //console.log(this.currentModel);
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
                //console.log(models);
                //console.log(this.collection);
                //console.log(this.currentModel);
                var that = this,
                    i = 0;
                for (i = 0; i < models.length; ++i) {
                    this.currentModel.attach(models[i], function () {
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
                    case "markers":
                        cols = ["ID", "Lat", "Lng", "Title", "Caption",
                        "Photos",
                        "Audio",
                        "Tags", "Owner", "Delete"];
                        return cols;
                    default:
                        cols = ["ID", "Lat", "Lng"];
                        for (var i = 0; i < this.fields.length; ++i) {
                            cols.push(this.fields.at(i).get("col_name") + " " + "<a class='fa fa-minus-circle delete_column' fieldIndex= '"+ i +"' aria-hidden='true'></a>");
                        }
                        cols.push("Photos");
                        cols.push("Audio");
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
                    case "markers":
                        return [30, 80, 80, 200, 400, 100, 100, 200, 80, 100];
                    default:
                        var cols = [30, 80, 80];
                        for (var i = 0; i < this.fields.length; ++i){
                            cols.push(150);
                        }
                        return cols;
                }
            },

            doSearch: function (term) {

                // If form exist, do search with 3 parameters, otherwise, do search with two parameters
                if (this.collection.key.indexOf("form_")){
                    this.collection.doSearch(term, this.app.getProjectID(), this.fields);
                } else {
                    this.collection.doSearch(term, this.app.getProjectID());
                }

            },

            clearSearch: function () {
                this.collection.clearSearch();
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
                    case "markers":
                       return [
                            { data: "id", readOnly: true},
                            { data: "lat", type: "numeric", format: '0.00000' },
                            { data: "lng", type: "numeric", format: '0.00000' },
                            { data: "name", renderer: "html"},
                            { data: "caption", renderer: "html"},
                            { data: "photos", renderer: this.photoCountRenderer.bind(this), readOnly: true, disableVisualSelection: true },
                            { data: "audio", renderer: this.audioCountRenderer.bind(this), readOnly: true, disableVisualSelection: true},
                            { data: "tags", renderer: "html" },
                            { data: "owner", readOnly: true},
                            { data: "button", renderer: this.buttonRenderer.bind(this), readOnly: true, disableVisualSelection: true}
                       ];
                    default:
                        var cols = [
                            { data: "id", readOnly: true },
                            { data: "lat", type: "numeric", format: '0.00000' },
                            { data: "lng", type: "numeric", format: '0.00000' }
                        ];
                        for (var i = 0; i < this.fields.length; ++i){
                            // Make sure to add in the "-" symbol after field name to delete column
                            var type = this.fields.at(i).get("data_type").toLowerCase();
                            switch (type) {
                                case "boolean":
                                    type = "checkbox";
                                    break;
                                case "integer":
                                    type = "numeric";
                                    break;
                                default:
                                    type = "text";
                            }
                            cols.push({
                                data: this.fields.at(i).get("col_name"),
                                type: type
                            })
                        };
                        cols.push(
                            {data: "photos", renderer: "html", readOnly: true, disableVisualSelection: true }
                        );

                        cols.push(
                            {data: "audio", renderer: "html", readOnly: true, disableVisualSelection: true }
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
            addRow: function () {

                var that = this;
                var projectID = this.app.getProjectID();
                var rec;

                if (this.app.dataType == "markers"){
                    rec = new Marker({project_id: projectID});
                } else {
                    rec = new Record ({project_id: projectID});
                }

                rec.collection = this.collection;
                rec.save(null, {
                    // The error occurs when there are no rows
                    success: function(){
                        that.collection.add(rec);
                        that.renderSpreadsheet();
                    }
                });

            }

        });
        return Spreadsheet;
    });
