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
                this.listenTo(this.collection, 'all', this.logEvents);
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
                this.collection.splice = function (index, howMany) {
                    var args = _.toArray(arguments).slice(2).concat({at: index}),
                        removed = this.models.slice(index, index + howMany);
                    this.remove(removed).add.apply(this, args);
                    return removed;
                };
                console.log(this.collection.splice);
                var container1 = this.$el.find('#grid').get(0);
                this.table = new Handsontable(container1, {
                    data: this.collection, //.toJSON(),
                    colWidths: [200, 200, 200, 80],
                    colHeaders: ["Title", "Description", "Tags", "Owner"],
                    manualColumnResize: true,
                    manualRowResize: true,
                    rowHeaders: true,
                    columns: [
                        { data: this.attr("name"), renderer: "html"},
                        { data: this.attr("caption"), renderer: "html"},
                        { data: this.attr("tags"), renderer: "html"},
                        { data: this.attr("owner"), renderer: "html"}
                    ]
                });
            },
            attr: function (attr) {
                // this lets us remember `attr` for when when it is get/set
                return function (model, value) {
                    if (_.isUndefined(value)) {
                        return model.get(attr);
                    }
                    model.set(attr, value);
                    //return "";
                };
            },
            logEvents: function (event, model) {
                //todo: research this
                console.log(event, model);
                var now = new Date(),
                    option = document.createElement('OPTION'),
                    eventHolder = this.$el.find('#logging').get(0);
                option.innerHTML = [':', now.getSeconds(), ':', now.getMilliseconds(), '[' + event + ']',
                    JSON.stringify(model)].join(' ');
                eventHolder.insertBefore(option, eventHolder.firstChild);
                if (event == "change") {
                    console.log("saving");
                    model.save();
                    /*model.save(attrs, {patch: true})*/
                }
            }

        });
        return Spreadsheet;
    });