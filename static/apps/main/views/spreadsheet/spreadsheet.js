define(["jquery",
        "marionette",
        "underscore",
        "handlebars",
        "views/media_browser",
        "views/create-media",
        "models/record",
        "models/audio",
        "models/video",
        "collections/photos",
        "collections/audio",
        "collections/videos",
        "views/field-child-view",
        "models/field",
        "handsontable",
        "text!../../templates/spreadsheet/spreadsheet.html",
        "text!../../templates/spreadsheet/create-field.html",
        "lib/audio/audio-player",
        "lib/carousel/carousel",
        "apps/main/views/spreadsheet/context-menu"
    ],
    function ($, Marionette, _, Handlebars, MediaBrowser, MediaUploader,
        Record, AudioModel, Video, Photos, Audio, Videos, CreateFieldView, Field, Handsontable,
        SpreadsheetTemplate, CreateFieldTemplate, AudioPlayer, Carousel,
        SpreadsheetMenu) {
        'use strict';
        var Spreadsheet = Marionette.ItemView.extend({
            /**
            NOTE: HERE ARE THE OPEN SOURCE DOCS:
            https://docs.handsontable.com/4.0.0/ColumnSorting.html#sort
            */
            template: function () {
                return Handlebars.compile(SpreadsheetTemplate);
            },
            invalidCells: {},
            table: null,
            className: 'spreadsheet-panel',
            currentModel: null,
            show_hide_deleteColumn: true,
            events: {
                'click #addColumn': 'showCreateFieldForm',
                'click .addMedia': 'showMediaBrowser',
                'click .column-opts' : 'showContextMenu',
                'click .carousel-media': 'carouselMedia',

            },
            foo: "bar",
            initialize: function (opts) {
                _.extend(this, opts);
                this.popover = this.app.popover;
                Marionette.ItemView.prototype.initialize.call(this);
                this.registerRatingEditor();

                this.listenTo(this.collection, 'reset', this.renderSpreadsheet);
                this.listenTo(this.fields, 'reset', this.renderSpreadsheet);
                this.listenTo(this.fields, 'update', this.renderSpreadsheet);
                this.listenTo(this.fields, 'add', this.renderSpreadsheet);

                this.listenTo(this.app.vent, 'search-requested', this.doSearch);
                this.listenTo(this.app.vent, 'clear-search', this.clearSearch);
                this.listenTo(this.app.vent, "render-spreadsheet", this.renderSpreadsheet);
                this.listenTo(this.app.vent, 'add-models-to-marker', this.attachModels);
                this.listenTo(this.app.vent, "field-updated", this.refreshHeaders);
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
            onShow: function () {
                console.log('rendering spreadsheet!');
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
                    console.log('setting field order to:', newPosition);

                    field.set("ordering", newPosition);
                    field.save({"ordering": newPosition}, { patch: true, wait: true });
                }
            },
            renderSpreadsheet: function () {
                console.log('rendering spreadsheet...');
                // console.log(this.collection.toJSON());
                const data = this.collection.map(model => {
                    var rec = model.toJSON();
                    if (rec.tags) {
                        rec.tags = rec.tags.join(", ");
                    }
                    return rec;
                });
                if (this.table) {
                    this.table.destroy();
                }

                if (data.length == 0) {
                    // Render spreadsheet should be called after every removal of rows
                    this.$el.find('#grid').html('<div class="empty-message">' +
                        'No rows have been added yet.' +
                        '</div>');
                    return;
                }
                const that = this;
                this.table = new Handsontable(this.$el.find('#grid').get(0), {
                    data: data,
                    autoRowSize: true,
                    undo: true,
                    manualColumnResize: true,
                    manualColumnMove: true,
                    //autoRowSize: true,
                    //rowHeaders: true,
                    autoInsertRow: true,
                    sortIndicator: true,
                    columnSorting: true,
                    height: $(window).height() - 170,
                    fixedRowsTop: 0,
                    colWidths: this.getColumnWidths(),
                    rowHeights: 55,
                    colHeaders: this.getColumnHeaders(),
                    columns: this.getColumns(),
                    maxRows: this.collection.length,
                    stretchH: "all",
                    afterValidate: function (isValid, value, rowIndex, prop, source) {
                        // because of limitations in Hansontable, we need to
                        // manually track which cells are valid / invalid:
                        console.log('afterValidate', that.table);
                        if (!isValid) {
                            var model = that.getModelFromCell(null, rowIndex);
                            if (!that.invalidCells[model.id]) {
                                that.invalidCells[model.id] = [];
                            }
                            that.invalidCells[model.id].push(prop)
                            if (prop === 'lat' || prop === 'lng') {
                                that.invalidCells[model.id].push('geometry');
                            }
                        }
                    },
                    afterChange: function (changes, source) {
                        //console.log('afterChange', that.table);
                        that.saveChanges(changes, source);
                        if (changes && changes[0] && changes[0].length > 1 && changes[0][1] === "video_provider") {
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
                //sync with collection:
                source = source.split(".");
                source = source[source.length - 1];
                var i, idx, key, oldVal, newVal, model, geoJSON;
                if (_.contains([
                            "edit",
                            "autofill",
                            "fill",
                            "undo",
                            "redo",
                            "paste"
                        ], source)) {
                    if (source === "paste") {
                        console.log(changes);
                    }
                    var changedModels = {};
                    for (i = 0; i < changes.length; i++) {
                        idx = changes[i][0];
                        key = changes[i][1];
                        oldVal = changes[i][2];
                        newVal = changes[i][3];
                        if (oldVal === newVal) {
                            continue;
                        }
                        //Note: relies on the fact that the first column is the ID column
                        //      see the getColumns() function below
                        model = this.getModelFromCell(null, idx);
                        if (!changedModels[model.id]) {
                            changedModels[model.id] = {
                                model: model,
                                changedAttributes: {}
                            };
                        }
                        if (key === 'lat' || key === 'lng') {
                            //SV TODO: To handle polygons and polylines, only set latLng if current
                            //          geometry is null of of type "Point." Still TODO.
                            // Good article: https://handsontable.com/blog/articles/4-ways-to-handle-read-only-cells
                            model.set(key, newVal);
                            if (model.get("lat") && model.get("lng")) {
                                geoJSON = model.setPointFromLatLng(model.get("lat"), model.get("lng"));
                                changedModels[model.id].changedAttributes.geometry = JSON.stringify(geoJSON);
                            } else {
                                changedModels[model.id].changedAttributes.geometry = null;
                            }
                        } else {
                            changedModels[model.id].changedAttributes[key] = newVal;
                        }
                    }
                    // Commit to database all at once:
                    for (key in changedModels) {
                        var m = changedModels[key].model,
                            changedAttributes = changedModels[key].changedAttributes,
                            invalidAttributes = this.invalidCells[m.id] || [];
                        //remove any staged changes that are invalid:
                        invalidAttributes.forEach(function (prop) {
                            delete changedAttributes[prop];
                        });
                        if (Object.values(changedAttributes) === 0) {
                            continue;
                        }
                        m.save(changedAttributes, {
                            patch: true,
                            wait: true,
                            success: () => {
                                //coordinates change with rebinning of symbol in LayerListChildView:
                                m.trigger('record-updated', m);
                            }
                        });
                    }
                    //clear out invalidCells:
                    this.invalidCells = {};
                }
            },
            getModelFromCell: function (table, index) {
                table = table || this.table;
                const modelID = table.getDataAtRowProp(index, 'id');
                return this.collection.get(modelID);
            },

            htmlLinkRenderer: function (instance, td, rowIndex, colIndex, prop, value, cellProperties) {
                var htmlLink = "<a href='" + value + "' >" + value + "</a>"
                td.innerHTML = htmlLink;


                return td;
            },

            thumbnailRenderer: function (instance, td, rowIndex, colIndex, prop, value, cellProperties) {
                var that = this,
                    img = document.createElement('IMG'),
                    model = this.collection.at(rowIndex),
                    carousel = new Carousel({
                        model: model,
                        mode: "photos",
                        app: that.app,
                        collection: new Photos(model, { projectID: this.app.getProjectID() })
                    });
                img.src = value;
                img.onclick = function (e) {
                    that.showModal(carousel);
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
                //return td;
                // I found the problem is that id is set to "videos" string rather than a number
                // and that id being set to "videos" can only happen at this javascript file
                var that = this,
                    img = document.createElement('IMG'),
                    model = this.getModelFromCell(instance, rowIndex),
                    i = document.createElement('i'),
                    carousel = new Carousel({
                        model: model,
                        mode: "videos",
                        app: that.app,
                        collection: new Videos(model, { projectID: this.app.getProjectID() })
                    });
                //if (!model) return;
                if (model.get('video_provider') === "vimeo") {
                    i.className = "fa fa-3x fa-vimeo";
                } else {
                    i.className = "fa fa-3x fa-youtube";
                }
                i.onclick = function () {
                    that.showModal(carousel);
                    $("#carouselModal").find("iframe").get(0).className = "modal-content spreadsheet";
                    $("#carouselModal").find("iframe").css({
                        width: "70%",
                        //height: "480px"
                    });
                };
                Handsontable.Dom.empty(td);
                td.appendChild(i);
                return td;
            },
            photoListRenderer: function (instance, td, row, col, prop, value, cellProperties) {
                td.innerHTML = '';
                const model = this.getModelFromCell(instance, row);
                if (model) {
                    const ids = model.get("attached_photos_ids") || [];
                    const imageList = ids.map(id => {
                        const photo = this.app.dataManager.getPhoto(id);
                        if (photo) {
                            const imageURL = photo.get('path_marker_lg');
                            return `<img src="${imageURL}" />`;
                        }
                        return '';
                    });
                    td.innerHTML = imageList.join('');
                }
                return td;
            },

            audioListRenderer: function (instance, td, row, col, prop, value, cellProperties) {
                td.innerHTML = '';
                const model = this.getModelFromCell(instance, row);
                const ids = model.get("attached_audio_ids") || [];
                ids.forEach(id => {
                    const audioModel = this.app.dataManager.getAudio(id);
                    if (audioModel) {
                        const player = new AudioPlayer({
                            model: audioModel,
                            audioMode: "basic",
                            app: this.app
                        });
                        $(td).append(player.$el.css({
                            display: 'inline-block'
                        }));
                    }
                });
                return td;
            },

            videoListRenderer: function (instance, td, row, col, prop, value, cellProperties) {
                td.innerHTML = '';
                const model = this.getModelFromCell(instance, row);
                const ids = model.get("attached_videos_ids") || [];
                const iframeList = ids.map(id => {
                    const video = this.app.dataManager.getVideo(id);
                    if (video) {
                        const videoURL = video.getEmbedLink();
                        const size = '50px';
                        return `<iframe src="${videoURL}"
                                style="width:${size};height:${size}" frameborder="0"
                                allowfullscreen></iframe>`;
                    }
                    return '';
                });
                td.innerHTML = iframeList.join(' ');
                return td;
            },

            mediaCountRenderer: function (instance, td, row, col, prop, value, cellProperties) {
                var model = this.getModelFromCell(instance, row);
                const photoCount = model.get("attached_photos_ids") ? model.get("attached_photos_ids").length : 0;
                const audioCount = model.get("attached_audio_ids") ? model.get("attached_audio_ids").length : 0;
                const videoCount = model.get("attached_videos_ids") ? model.get("attached_videos_ids").length : 0;
                td.innerHTML = '';
                if (photoCount) {
                    td.innerHTML += `<p>photos: ${photoCount}</p>`
                }
                if (audioCount) {
                    td.innerHTML += `<p>audio files: ${audioCount}</p>`
                }
                if (videoCount) {
                    td.innerHTML += `<p>videos: ${videoCount}</p>`
                }
                return td;

            },
            showModal: function(carousel) {
                $("#carouselModal").empty();
                $("#carouselModal").append(carousel.$el);
                var $span = $("<span class='close big'>&times;</span>");
                $span.click(function () {
                    $("#carouselModal").hide();
                })
                $("#carouselModal").append($span);
                var modal = document.getElementById('carouselModal');
                modal.style.display = "block";
            },

            makeCarousel: function (e) {
                /*
                  Make sure all carousels are initalized
                  Need that to be called for each and every row upon rendering spreadsheet
                */
                var that = this,
                    rowIndex = $(e.target).attr("row-index"),
                    collection;
                this.currentModel = this.collection.at(parseInt(rowIndex));
                this.currentModel.fetch({
                    success: function () {
                        collection = new Backbone.Collection();
                        var photoCollection = that.currentModel.get("media").photos,
                            audioCollection = that.currentModel.get("media").audio,
                            videoCollection = that.currentModel.get("media").videos;
                        if (photoCollection){
                            collection.add(that.currentModel.get("media").photos.data);
                        }
                        if (videoCollection){
                            collection.add(that.currentModel.get("media").videos.data);
                        }

                        /*
                        So the carousel development has to be expanded
                        so that it matches with data detail's
                        carousel expansion
                        */

                        var carousel = new Carousel({
                            model: that.currentModel,
                            app: that.app,
                            collection: collection
                        });

                        that.showModal(carousel);

                        // Let's test this little experimentation out
                        var a;
                        if (audioCollection && audioCollection.data.length > 0) {
                            audioCollection.data.forEach(function (audioTrack, i) {
                                a = new AudioPlayer({
                                    model: new AudioModel(audioTrack),
                                    app: that.app,
                                    audioMode: "detail",
                                    className: "audio-detail"
                                });
                                carousel.$el.append(a.$el);
                            });
                        }
                        //carousel.append(c.$el);
                    }
                });
            },

            carouselMedia: function(e){
                this.makeCarousel(e);
            },

            buttonRenderer: function (instance, td, row, col, prop, value, cellProperties) {
                var that = this,
                    model;
                const icon = document.createElement('i');
                icon.classList.add('fa', 'fa-trash');
                Handsontable.Dom.empty(td);
                td.appendChild(icon);
                icon.onclick = function () {
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

                    if(that.collection.length == 0){
                        that.renderSpreadsheet();
                    }

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
                if (row_idx != undefined){
                    this.currentModel = this.collection.at(parseInt(row_idx));
                }
                var mediaBrowser = new MediaBrowser({
                    app: this.app,
                    parentModel: this.currentModel
                });
                this.app.vent.trigger("show-modal", {
                    title: 'Media Browser',
                    width: 1100,
                    //height: 400,
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
                    var photoIds= this.currentModel.get("attached_photos_ids"),
                        audioIds= this.currentModel.get("attached_audio_ids"),
                        videoIds= this.currentModel.get("attached_videos_ids");
                    var photoCount = photoIds != null ? photoIds.length : 0,
                        audioCount = audioIds != null ? audioIds.length : 0,
                        videoCount = videoIds != null ? videoIds.length : 0,
                        ordering = photoCount + audioCount + videoCount;
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
            getMenuTemplate: function (index) {
                return `<a class="fa fa-ellipsis-v column-opts" fieldIndex="${index}" aria-hidden="true"></a>`;
            },

            getColumnHeaders: function () {
                const cols = [
                    "ID" + this.getMenuTemplate(0),
                    "Lat" + this.getMenuTemplate(1),
                    "Lng" + this.getMenuTemplate(2)
                ];

                for (var i = 0; i < this.fields.length; ++i) {
                    const menuButton = this.show_hide_deleteColumn ? this.getMenuTemplate(i + 3) : '';
                    cols.push(
                        '<span class="hide-overflow">' +
                        this.fields.at(i).get("col_alias") +
                        '</span>' +
                        menuButton
                    );
                    // cols.push(
                    //     this.fields.at(i).get("col_alias") + menuButton
                    // );
                }
                cols.push("Photos");
                cols.push("Audio Files");
                cols.push("Video");
                cols.push("Delete");
                return cols;
            },
            getColumnWidths: function () {
                const cols = [50, 100, 100];
                this.fields.forEach(field => {
                    if (field.get('data_type') === 'integer') {
                        cols.push(120);
                    } else if (field.get('data_type') === 'text') {
                        cols.push(250);
                    } else {
                        cols.push(150);
                    }
                })
                cols.push(250);  // photos column
                cols.push(210);  // audio column
                cols.push(210);  // video column
                cols.push(50);   // delete column
                return cols;
            },

            doSearch: function (term) {

                // If form exist, do search with 3 parameters, otherwise, do search with two parameters]
                if (this.collection.getIsCustomType()){
                    this.collection.doSearch(term, this.app.getProjectID(), this.fields);
                } else {
                    this.collection.doSearch(term, this.app.getProjectID());
                }

            },

            clearSearch: function () {
                this.collection.clearSearch(this.app.getProjectID());
            },

            getColumns: function () {
                switch (this.collection.getDataType()) {
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
                           { data: "video_link", renderer: this.htmlLinkRenderer.bind(this), readOnly: true},
                           { data: "tags", renderer: "html" },
                           { data: "attribution", renderer: "html"},
                           { data: "owner", readOnly: true},
                           { data: "button", renderer: this.buttonRenderer.bind(this), readOnly: true, disableVisualSelection: true}
                      ];
                    default:
                        if (!this.fields) {
                            return null;
                        }
                        var cols = [
                            { data: "id", readOnly: true },
                            { data: "lat", type: "numeric", format: '0.00000' },
                            { data: "lng", type: "numeric", format: '0.00000' }
                        ];
                        for (var i = 0; i < this.fields.length; ++i) {
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
                            { data: "media", renderer: this.photoListRenderer.bind(this), readOnly: true, disableVisualSelection: true },
                            { data: "media", renderer: this.audioListRenderer.bind(this), readOnly: true, disableVisualSelection: true },
                            { data: "media", renderer: this.videoListRenderer.bind(this), readOnly: true, disableVisualSelection: true },
                            { data: "button", renderer: this.buttonRenderer.bind(this), readOnly: true, disableVisualSelection: true }
                        );
                        return cols;
                }
            },

            showCreateFieldForm: function () {
                var formID = this.app.dataType.split("_")[1];
                var fieldView = new CreateFieldView({
                    formID: formID,
                    fields: this.fields,
                    app: this.app,
                    model: new Field(null, { id: formID }),
                    template: Handlebars.compile(CreateFieldTemplate),
                    tagName: "div"
                });
                this.app.vent.trigger('show-modal', {
                    title: "Create New Column",
                    view: fieldView,
                    saveFunction: fieldView.saveField,
                    width: 600,
                    height: 300
                });
            },

            showContextMenu: function (e) {
                const src = e.srcElement;
                const headerLink = src.parentNode;
                const columnID = parseInt($(src).attr('fieldIndex'));
                this.popover.update({
                    $source: event.target,
                    view: new SpreadsheetMenu({
                        app: this.app,
                        collection: this.collection,
                        table: this.table,
                        fields: this.fields,
                        field: this.fields.at(columnID - 3),
                        columnID: columnID,
                        headerLink: headerLink
                    }),
                    placement: 'bottom',
                    width: '180px'
                });
                if (e) {
                   e.stopImmediatePropagation();
                   e.preventDefault();
                }
            },
            addRow: function (top) {
                const dm = this.app.dataManager;
                dm.addRecordToCollection(this.collection, () => {
                    this.renderSpreadsheet();
                    this.$el.find('.wtHolder').scrollTop(top ? 0 : 10000); //scroll to either top or bottom
                });
            },
            refreshHeaders: function () {
                this.table.updateSettings({
                    colHeaders: this.getColumnHeaders()
                });
            }
        });
        return Spreadsheet;
    });
