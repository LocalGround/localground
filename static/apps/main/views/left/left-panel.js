define(["underscore",
        "jquery",
        "marionette",
        "handlebars",
        "apps/main/views/left/map-title-view",
        "apps/main/views/left/layer-list-view",
        "apps/main/views/left/skin-view",
        "apps/main/views/left/panel-styles-view",
        "text!../../templates/left/left-panel-layout.html"
    ],
    function (_, $, Marionette, Handlebars, MapTitleView, LayerListView, SkinView, PanelStylesView, LeftPanelLayoutTemplate) {
        'use strict';
        // More info here: http://marionettejs.com/docs/v2.4.4/marionette.layoutview.html
        var LeftPanelLayout = Marionette.LayoutView.extend({
            template: Handlebars.compile(LeftPanelLayoutTemplate),

            initialize: function (opts) {
                _.extend(this, opts);
            },
            events: {
                'click #new-layer-options a' : 'createNewLayer',
                'click .map-save' : 'saveMap',
                'click #map-delete': 'deleteMap'
            },

            regions: {
                menu: "#map_dropdown_region",
                layers: "#layers_region",
                skins: "#map_skin_region",
                styles: "#global_style_region"
            },
            onRender: function () {
                console.log('rendering left panel view...')

                this.menu.show(new MapTitleView({
                    app: this.app,
                    model: this.model
                }));
                this.layers.show(new LayerListView({
                    app: this.app,
                    model: this.model,
                    collection: this.model.getLayers()
                }));
                /*this.styles.show(new PanelStylesView({
                    app: this.app,
                    model: this.model
                }));
                this.skins.show(new SkinView({
                    app: this.app
                }));*/

            },

            saveMap: function () {
                this.model.set("zoom", this.app.getZoom());
                this.model.set("center", this.app.getCenter());
                this.model.set("basemap", this.app.getMapTypeId());
                this.model.save({
                    error: function () {
                        console.log('error');
                    },
                    success: function () {
                        console.log('success');
                    }
                });
            },

            deleteMap: function () {
                console.log(this.layers);
                console.log(this.layers.currentView.collection.length);
                if (!confirm("Are you sure you want to delete this map?")) {
                    return;
                }

                // delete selected map's layers
                var listModel;
                while (listModel = this.layers.currentView.collection.first()) {
                    listModel.destroy();
                }

                // delete selected map
                this.model.destroy();

                this.app.router.navigate('//');

            }
        });
        return LeftPanelLayout;
    });
