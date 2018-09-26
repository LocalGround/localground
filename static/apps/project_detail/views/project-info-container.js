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
            events: {
                'click #maps-section_button': 'showMaps',
                'click #datasets-section_button': 'showDatasets',
            },
            initialize: function (opts) {
                _.extend(this, opts);
                this.template = Handlebars.compile(InfoContainerTemplate);
                this.displayMode = 'maps';
            },

            onRender: function () {
                
                this.showMapList();
                this.showDatasetList();
                this.toggleDisplayMode(this.displayMode);
            },

            toggleDisplayMode: function(displayMode) {
                if (displayMode === 'maps') {
                    this.datasetListRegion.$el.hide();
                    this.mapListRegion.$el.show();
                    this.$el.find('#maps-section_button').addClass('active').removeClass('inactive');
                    this.$el.find('#datasets-section_button').addClass('inactive').removeClass('active');
                } else if (displayMode === 'datasets') {
                    this.mapListRegion.$el.hide();
                    this.datasetListRegion.$el.show();
                    this.$el.find('#datasets-section_button').addClass('active').removeClass('inactive');
                    this.$el.find('#maps-section_button').addClass('inactive').removeClass('active');
                    
                }
            },

            showMaps: function() {
                if (this.displayMode !== 'maps') {
                    this.displayMode = 'maps';
                    this.toggleDisplayMode(this.displayMode);
                }
                
            },

            showDatasets: function() {
                if (this.displayMode !== 'datasets') {
                    this.displayMode = 'datasets';
                    this.toggleDisplayMode(this.displayMode);
                }
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
