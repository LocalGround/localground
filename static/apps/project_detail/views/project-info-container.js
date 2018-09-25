define(["marionette",
        "handlebars",
        "apps/project_detail/views/map-list-manager",
        "apps/project_detail/views/dataset-list-manager",
        "text!../templates/info-container.html"
    ],
    function (Marionette, Handlebars, MapListView, DatasetListView, InfoContainerTemplate)  {
        'use strict';
        const InfoContainer = Marionette.LayoutView.extend({
            regions: {
                mapListRegion: '.project_map-list',
                datasetListRegion: '.project_dataset-list'
            },
            // events: {
            //     'click .title': 'openRenameForm'
            // },
            initialize: function (opts) {
                _.extend(this, opts);
                this.template = Handlebars.compile(InfoContainerTemplate);
                
            },

            onRender: function () {
                this.showMapList();
                this.showDatasetList();
            },
            showMapList: function() {
                this.mapListView = new MapListView({
                    model: this.model,
                    app: this.app,
                    collection: this.app.dataManager.getMaps()
                });
                this.mapListRegion.show(this.mapListView);
            },
            showDatasetList: function() {
                console.log('not a bacbone collection', this.app.dataManager.getDatasets());
                console.log(new Backbone.Collection(this.app.dataManager.getDatasets()));
                let datasets = this.app.dataManager.getDatasets().map((item) => {
                    return {
                        name: item.name,
                        models: item.models,
                        dataType: item.dataType,
                        description: item.description,
                        projectID: item.projectID
                    }
                });
    
                this.datasetListView = new DatasetListView({
                    model: this.model,
                    app: this.app,
                    collection: new Backbone.Collection(datasets)
                });
                this.datasetListRegion.show(this.datasetListView);
            }

        });
        return InfoContainer;
    });
