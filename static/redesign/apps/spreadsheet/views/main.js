define(["marionette",
        "underscore",
        "handlebars",
        "collections/photos",
        "collections/audio",
        "collections/fields",
        "collections/records",
        "collections/markers",
        "models/record",
        "models/marker",
        "apps/spreadsheet/views/create-field",
        "handsontable",
        "text!../templates/spreadsheet.html"],
    function (Marionette, _, Handlebars, Photos, Audio, Fields, Records, Markers,
              Record, Marker, CreateFieldView, Handsontable, SpreadsheetTemplate) {
        'use strict';
        var Spreadsheet = Marionette.ItemView.extend({
            template: function () {
                return Handlebars.compile(SpreadsheetTemplate);
            },
            table: null,
            events: {
                'click #addColumn': 'showCreateFieldForm',
                'click .delete_column' : 'deleteField'
            },
            initialize: function (opts) {
                _.extend(this, opts);

                // call Marionette's default functionality (similar to "super")
                Marionette.ItemView.prototype.initialize.call(this);
                this.displaySpreadsheet();

                //listen to events that fire from other parts of the application:
                this.listenTo(this.app.vent, 'search-requested', this.doSearch);
                this.listenTo(this.app.vent, 'clear-search', this.clearSearch);
                this.listenTo(this.app.vent, "render-spreadsheet", this.renderSpreadsheet);
                this.listenTo(this.app.vent, "add-row", this.addRow);
            },
            displaySpreadsheet: function () {
                //fetch data from server according to mode:
                var that = this,
                    id;
                if (this.app.dataType == "photos") {
                    this.collection = new Photos();
                } else if (this.app.dataType ==  "audio") {
                    this.collection = new Audio();
                } else if (this.app.dataType == "markers") {
                    this.collection = new Markers();
                } else if (this.app.dataType.indexOf("form_") != -1) {
                    id = this.app.dataType.split("_")[1];
                    // column names:
                    this.fields = new Fields(null, {
                        id: id
                    });
                    this.collection = new Records(null, {
                        url: '/api/0/forms/' + id + '/data/'
                    });
                    this.fields.fetch({
                        success: function () {
                            that.collection.fetch({ reset: true });
                        }
                    });
                } else {
                    alert("Type not accounted for.");
                    return;
                }
                this.listenTo(this.collection, 'reset', this.renderSpreadsheet);
                this.collection.query = this.getDefaultQueryString();
                this.collection.fetch({ reset: true });
            },
            getDefaultQueryString: function () {
                return "WHERE project = " + this.app.selectedProject.id;
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
                            model = this.getModelFromCell(idx);
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
            getModelFromCell: function (index) {
                var modelID = this.table.getDataAtRowProp(index, "id");
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
                    model = that.getModelFromCell(rowIndex);
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
                td.innerHTML = "<audio controls>" +
                    "<source src='" + value + "'></source>" +
                    "</audio>";
                return td;
            },

            photoCountRenderer: function(instance, td, row, col, prop, value, cellProperties){
                //
                console.log(this);
                console.log(instance);
                console.log(row);
                //var that = this;
                /*
                // I have almost made progress, but I have encountered null / undefined errors
                // despite making sense of what came intuitively

                var model = this.getModelFromCell(row);
                var count = model.get("photo_count");
                if (count < 0){
                    for (var i = 0; i < count; ++i){
                        //
                        td.innerHTML.appendChild("<i class='fa fa-file-photo-o' aria-hidden='true'></i>");
                    }
                }
                //*/

            },

            audioCountRenderer: function(instance, td, row, col, prop, value, cellProperties){
                //
                //var that = this;
                /*
                var model = this.getModelFromCell(row);
                var count = model.get("audio_count");
                if (count < 0){
                    for (var i = 0; i < count; ++i){
                        //
                        td.innerHTML.appendChild("<i class='fa fa-file-audio-o' aria-hidden='true'></i>");
                    }
                }
                //*/

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
                    model = that.getModelFromCell(row);

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

            getColumnHeaders: function () {
                var cols;
                switch (this.collection.key) {
                    case "audio":
                        return ["ID", "Lat", "Lng", "Title", "Caption", "Audio", "Tags", "Attribution", "Owner", "Delete"];
                    case "photos":
                        return ["ID", "Lat", "Lng", "Title", "Caption", "Thumbnail", "Tags", "Attribution", "Owner", "Delete"];
                    case "markers":
                        return ["ID", "Lat", "Lng", "Title", "Caption", "Photos", "Audio", "Tags", "Owner", "Delete"];
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
                    this.collection.doSearch(term, this.app.selectedProject.id, this.fields);
                } else {
                    this.collection.doSearch(term, this.app.selectedProject.id);
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
                            { data: "file_path", renderer: this.audioRenderer, readOnly: true},
                            { data: "tags", renderer: "html" },
                            { data: "attribution", renderer: "html"},
                            { data: "owner", readOnly: true},
                            { data: "button", renderer: this.buttonRenderer.bind(this), readOnly: true}
                        ];
                    case "photos":
                       return [
                            { data: "id", readOnly: true},
                            { data: "lat", type: "numeric", format: '0.00000' },
                            { data: "lng", type: "numeric", format: '0.00000' },
                            { data: "name", renderer: "html"},
                            { data: "caption", renderer: "html"},
                            { data: "path_marker_lg", renderer: this.thumbnailRenderer.bind(this), readOnly: true},
                            { data: "tags", renderer: "html" },
                            { data: "attribution", renderer: "html"},
                            { data: "owner", readOnly: true},
                            { data: "button", renderer: this.buttonRenderer.bind(this), readOnly: true}
                       ];
                    case "markers":
                       return [
                            { data: "id", readOnly: true},
                            { data: "lat", type: "numeric", format: '0.00000' },
                            { data: "lng", type: "numeric", format: '0.00000' },
                            { data: "name", renderer: "html"},
                            { data: "caption", renderer: "html"},
                            { data: "photos", renderer: this.photoCountRenderer.bind(this), readOnly: true},
                            { data: "audio", renderer: this.audioCountRenderer.bind(this), readOnly: true},
                            { data: "tags", renderer: "html" },
                            { data: "owner", readOnly: true},
                            { data: "button", renderer: this.buttonRenderer.bind(this), readOnly: true}
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
                            {data: "photos", renderer: "html", readOnly: true}
                        );

                        cols.push(
                            {data: "audio", renderer: "html", readOnly: true}
                        );

                        cols.push(
                            {data: "button", renderer: this.buttonRenderer.bind(this), readOnly: true}
                        );

                        cols.push(
                            {data: "addField", renderer: "html", readOnly: true}
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
                var projectID = this.app.selectedProject.id;
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
