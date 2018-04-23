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
    function (_, $, Marionette, Handlebars, MapTitleView, LayerListView,
                SkinView, PanelStylesView, LeftPanelLayoutTemplate) {
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
                'click #map-delete': 'deleteMap',
                'click .show-hide': 'toggleList'
            },

            regions: {
                menu: "#map_title",
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
                if (!confirm("Are you sure you want to delete this map?")) {
                    return;
                }
                this.app.dataManager.destroyMap(this.model);
                this.app.router.navigate('//');

            },
            toggleList: function (e) {
                if (e.srcElement.classList.contains('hide')) {
                    this.app.vent.trigger('hide-list');
                } else {
                    this.app.vent.trigger('unhide-list');
                }
                e.srcElement.classList.toggle('hide');
                e.srcElement.classList.toggle('show');
            }
        });
        return LeftPanelLayout;
    });
