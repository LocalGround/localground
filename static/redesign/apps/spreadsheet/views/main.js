define(["marionette",
        "underscore",
        "handlebars",
        "collections/photos",
        "collections/audio",
        "handsontable",
        "text!../templates/spreadsheet.html"],
    function (Marionette, _, Handlebars, Photos, Audio, Handsontable, SpreadsheetTemplate) {
        'use strict';
        var Spreadsheet = Marionette.ItemView.extend({
            template: function () {
                return Handlebars.compile(SpreadsheetTemplate);
            },
            table: null,
            initialize: function (opts) {
                _.extend(this, opts);

                // call Marionette's default functionality (similar to "super")
                Marionette.ItemView.prototype.initialize.call(this);
                this.displaySpreadsheet();
                this.listenTo(this.collection, 'reset', this.renderSpreadsheet);

                //listen to events that fire from other parts of the application:
                this.listenTo(this.app.vent, 'search-requested', this.doSearch);
                this.listenTo(this.app.vent, 'clear-search', this.clearSearch);
            },
            displaySpreadsheet: function () {
                //fetch data from server according to mode:
                if (this.app.dataType == "photos") {
                    this.collection = new Photos();
                } else if (this.app.dataType ==  "audio") {
                    this.collection = new Audio();
                } else {
                    alert("Type not accounted for.");
                    return;
                }
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
                    rec.tags = rec.tags.join(", ");
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
                var i, idx, key, oldVal, newVal, modelID, model;
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
                            modelID = this.table.getDataAtRow(idx)[0];
                            model = this.collection.get(modelID);
                            model.set(key, newVal);
                            model.save(model.changedAttributes(), {patch: true, wait: true});
                        } else {
                            console.log("[" + source + "], but no value change. Ignored.");
                        }
                    }
                }
            },
            thumbnailRenderer: function (instance, td, row, col, prop, value, cellProperties) {
                var img = document.createElement('IMG');
                img.src = value;
                Handsontable.Dom.empty(td);
                td.appendChild(img);
                return td;
            },
            audioRenderer: function (instance, td, row, col, prop, value, cellProperties) {
                td.innerHTML = "<audio controls>" +
                    "<source src='" + value + "'></source>" +
                    "</audio>";
                return td;
            },
            getColumnHeaders: function () {
                var config = {
                    "audio": ["ID", "Title", "Caption", "Audio", "Tags", "Attribution", "Owner"],
                    "photos": ["ID", "Title", "Caption", "Thumbnail", "Tags", "Attribution", "Owner"]
                };
                return config[this.collection.key];
            },
            getColumnWidths: function () {
                var config = {
                    "audio": [30, 200, 400, 300, 200, 100, 80],
                    "photos": [30, 200, 400, 65, 200, 100, 80]
                };
                return config[this.collection.key];
            },

            doSearch: function (query) {
                query = "WHERE " + query + " AND project = " + this.app.selectedProject.id;
                this.collection.query = query;
                this.collection.fetch({ reset: true });
            },

            clearSearch: function () {
                this.collection.query = this.getDefaultQueryString();
                this.collection.fetch({ reset: true });
            },
            getColumns: function () {
                var config = {
                    "audio": [
                        { data: "id", readOnly: true},
                        { data: "name", renderer: "html"},
                        { data: "caption", renderer: "html"},
                        { data: "file_path", renderer: this.audioRenderer, readOnly: true},
                        { data: "tags", renderer: "html" },
                        { data: "attribution", renderer: "html"},
                        { data: "owner", readOnly: true}
                    ],
                    "photos": [
                        { data: "id", readOnly: true},
                        { data: "name", renderer: "html"},
                        { data: "caption", renderer: "html"},
                        { data: "path_marker_lg", renderer: this.thumbnailRenderer, readOnly: true},
                        { data: "tags", renderer: "html" },
                        { data: "attribution", renderer: "html"},
                        { data: "owner", readOnly: true}
                    ]
                };
                return config[this.collection.key];
            }

        });
        return Spreadsheet;
    });