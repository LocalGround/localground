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
                //this.listenTo(this.collection, 'all', this.commitToDatabaseWithDebugging);
                this.listenTo(this.collection, 'all', this.commitToDatabase);

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
                    i = 0;
                if (this.table) {
                    this.table.destroy();
                    this.table = null;
                }
                for (i = 0; i < this.collection.length; i++) {
                    rowHeights.push(55);
                }
                this.table = new Handsontable(grid, {
                    data: this.collection,
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
                    undo: false //doesn't work w/Backbone integration (though we could figure it out and make a PR)
                });
            },
            attr: function (attr) {
                // this lets us remember `attr` for when when it is get/set
                return function (model, value) {
                    if (_.isUndefined(value)) {
                        //console.log(attr);
                        return model.get(attr) || "";
                    }
                    model.set(attr, value);
                };
            },
            attrReadOnly: function (attr) {
                return function (model) {
                    return model.get(attr).toString();
                };
            },
            //todo: move this to a renderer function
            attrThumb: function (attr) {
                return function (model) {
                    return "<img src='" + model.get(attr) + "' />";
                };
            },
            //todo: move this to an audio function
            attrAudio: function (attr) {
                return function (model) {
                    return "<audio controls>" +
                            "<source src='" + model.get(attr) + "'></source>" +
                            "</audio>";
                };
            },
            attrTags: function (attr) {
                return function (model, value) {
                    if (_.isUndefined(value)) {
                        return model.get(attr).join(", ");
                    }
                    var tagList = value.split(/\s*,\s*/);
                    if (tagList[tagList.length - 1] == "") {
                        tagList.pop();
                    }
                    model.set(attr, tagList);
                };
            },
            commitToDatabaseWithDebugging: function (event, model) {
                var now = new Date(),
                    option = document.createElement('OPTION'),
                    eventHolder = this.$el.find('#logging').get(0);
                option.innerHTML = [':', now.getSeconds(), ':', now.getMilliseconds(), '[' + event + ']',
                    JSON.stringify(model)].join(' ');
                eventHolder.insertBefore(option, eventHolder.firstChild);
                this.commitToDatabase(event, model);
            },
            commitToDatabase: function (event, model) {
                if (event.toString().indexOf("change:") != -1 &&
                        event.toString().indexOf("path") == -1) {
                    console.log("saving...", event);
                    model.save(model.changedAttributes(), {patch: true, wait: true});
                }
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
                        { data: this.attr("id"), readOnly: true},
                        { data: this.attr("name"), renderer: "html"},
                        { data: this.attr("caption"), renderer: "html"},
                        { data: this.attrAudio("file_path"), renderer: "html", readOnly: true},
                        { data: this.attrTags("tags"), renderer: "html"},
                        { data: this.attr("attribution"), renderer: "html"},
                        { data: this.attrReadOnly("owner"), readOnly: true}
                    ],
                    "photos": [
                        { data: this.attr("id"), readOnly: true},
                        { data: this.attr("name"), renderer: "html"},
                        { data: this.attr("caption"), renderer: "html"},
                        { data: this.attrThumb("path_marker_lg"), renderer: "html", readOnly: true},
                        { data: this.attrTags("tags"), renderer: "html"},
                        { data: this.attr("attribution"), renderer: "html"},
                        { data: this.attrReadOnly("owner"), readOnly: true}
                    ]
                };
                return config[this.collection.key];
            }

        });
        return Spreadsheet;
    });