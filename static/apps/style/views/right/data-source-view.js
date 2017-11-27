define(["marionette",
        "handlebars",
        "collections/maps",
        "text!../../templates/right/data-source.html"
    ],
    function (Marionette, Handlebars, Maps, DataSourceTemplate) {
        'use strict';

        var DataSourceView = Marionette.ItemView.extend({

            template: Handlebars.compile(DataSourceTemplate),

            initialize: function (opts) {
                _.extend(this, opts);
            },

            events: {
                "change .layer-title": "updateTitle",
                "change .selected-data-source" : "changeDataSource"
            },

            templateHelpers: function () {
                return {
                    dataSource: this.app.dataManager.getLookup(),
                    currentDataSource: this.model.attributes.data_source
                };
            },

            changeDataSource: function() {
                var dataSource = this.$el.find(".selected-data-source").val();
                this.model.set("data_source", dataSource);
            },


            updateTitle: function () {
                var title = this.$el.find('.layer-title').val();
                this.model.set("title", title);
                this.app.vent.trigger("update-title", title);
            }

        });
        return DataSourceView;
    });



