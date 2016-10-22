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
            initialize: function (opts) {
                _.extend(this, opts);

                // call Marionette's default functionality (similar to "super")
                Marionette.ItemView.prototype.initialize.call(this);
                this.displaySpreadsheet();
                this.listenTo(this.collection, 'reset', this.renderSpreadsheet);
                this.listenTo(this.collection, 'all', this.debug);
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
                //need to enhance the collection in order for 
                //Backbone Collection to work
                this.collection.splice = function (index, howMany) {
                    var args = _.toArray(arguments).slice(2).concat({at: index}),
                        removed = this.models.slice(index, index + howMany);
                    this.remove(removed).add.apply(this, args);
                    return removed;
                };
                var grid = this.$el.find('#grid').get(0);
                this.table = new Handsontable(grid, {
                    data: this.collection, //.toJSON(),
                    colWidths: [200, 400, 200, 300, 80],
                    colHeaders: ["Title", "Description", "Tags", "File Name", "Owner"],
                    manualColumnResize: true,
                    manualRowResize: true,
                    rowHeaders: true,
                    columns: [
                        { data: this.attr("name"), renderer: "html"},
                        { data: this.attr("caption"), renderer: "html"},
                        { data: this.attrTags("tags"), renderer: "html"},
                        { data: this.attrReadOnly("file_name"), readOnly: true},
                        { data: this.attrReadOnly("owner"), readOnly: true}
                    ]
                });
            },
            attr: function (attr) {
                // this lets us remember `attr` for when when it is get/set
                return function (model, value) {
                    if (_.isUndefined(value)) {
                        return model.get(attr).toString();
                    }
                    model.set(attr, value);
                };
            },
            attrReadOnly: function (attr) {
                return function (model) {
                    return model.get(attr).toString();
                };
            },
            attrTags: function (attr) {
                return function (model, value) {
                    if (_.isUndefined(value)) {
                        return model.get(attr).join(", ");
                    }
                    var tagList = value.split(/[\s,]+/);
                    if (tagList[tagList.length - 1] == "") {
                        tagList.pop();
                    }
                    model.set(attr, tagList);
                };
            },
            debug: function (event, model) {
                var now = new Date(),
                    option = document.createElement('OPTION'),
                    eventHolder = this.$el.find('#logging').get(0);
                option.innerHTML = [':', now.getSeconds(), ':', now.getMilliseconds(), '[' + event + ']',
                    JSON.stringify(model)].join(' ');
                eventHolder.insertBefore(option, eventHolder.firstChild);
                if (event.toString().indexOf("change:") != -1 &&
                        event.toString().indexOf("path") == -1) {
                    console.log("saving...", event);
                    model.save(model.changedAttributes(), {patch: true, wait: true});
                }
            }

        });
        return Spreadsheet;
    });