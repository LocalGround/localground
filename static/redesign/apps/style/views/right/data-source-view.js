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
                this.dataSource = this.app.dataManager.getDataSources();
            },
            
            
            events: {
                //"change .layer-title": "updateTitle"
                "change .selected-data-source" : "changeDataSource"
            },
            
            templateHelpers: function () {
                return {
                    dataSource: this.dataSource,
                    currentDataSource: this.model.attributes.data_source
                };
            }

            /*
            updateTitle: function () {
                var title = this.$el.find('.layer-title').val();
                this.model.set("title", title);
                console.log(title);
                this.app.vent.trigger("update-title", title);
            }
            */
        });
        return DataSourceView;
    });