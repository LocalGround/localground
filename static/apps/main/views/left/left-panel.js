define(["jquery",
        "marionette",
        "handlebars",
        "apps/main/views/left/select-map-view",
        "apps/main/views/left/layer-list-view",
        "apps/main/views/left/skin-view",
        "apps/main/views/left/panel-styles-view",
        "text!../../templates/left/left-panel-layout.html"
    ],
    function ($, Marionette, Handlebars, SelectMapView, LayerListView, SkinView, PanelStylesView, LeftPanelLayoutTemplate) {
        'use strict';
        // More info here: http://marionettejs.com/docs/v2.4.4/marionette.layoutview.html
        var LeftPanelLayout = Marionette.LayoutView.extend({
            template: Handlebars.compile(LeftPanelLayoutTemplate),

            initialize: function (opts) {
                console.log('left panel intialize');
                /*This Layout View relies on a Map model which gets set from the change-map event,
                which is triggered from the select-map-view.js */
                this.app = opts.app;
                this.render();
                this.listenTo(this.app.vent, 'change-map', this.handleNewMap);
            },
            events: {
                'click #new-layer-options a' : 'createNewLayer',
                'click .hide': 'hidePanel',
                'click .show': 'showPanel',
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
                // only load views after the LayoutView has
                // been rendered to the screen:
                var skv = new SkinView({ app: this.app });
                this.sv = new SelectMapView({ app: this.app }),
                this.menu.show(this.sv);
                this.skins.show(skv);
            },

            handleNewMap: function (model) {
                var ps = new PanelStylesView({
                        app: this.app,
                        model: model
                    });
                console.log('create layer list');
                console.log(this);
                this.lv = new LayerListView({
                    app: this.app,
                    model: model,
                    collection: model.getLayers()
                });
                //set active model:
                this.app.selectedMapModel = model;
                this.app.model = model;
                this.model = model;

                //replace the PanelStylesView
                this.styles.show(ps);

                //replace the LayerListView:
                this.layers.show(this.lv);
                //this.app.vent.trigger('ready-for-routing');
            },
            hidePanel: function (e) {
                $(e.target).removeClass("hide").addClass("show");
                this.app.vent.trigger('hide-list');
                e.preventDefault();
            },
            showPanel: function (e) {
                $(e.target).removeClass("show").addClass("hide");
                this.app.vent.trigger('unhide-list');
                e.preventDefault();
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

                // delete marker overlays from selected map's layers
                this.lv.children.call("deleteOverlays");

                // delete selected map's layers
                var listModel;
                while (listModel = this.lv.collection.first()) {
                    listModel.destroy();
                }

                // delete selected map
                this.model.destroy();

                // re-render menu region
                this.menu.show(this.sv, {forceShow: true});

                //rerender layers
                //this.app.vent.trigger('update-layer-list');

                this.app.router.navigate();

                // resets the map list so the correct layers are displayed
                this.app.vent.trigger('update-map-list');

                // hide the right panel if it is open;
                //necessary so the user cannot edit a non-existent layer
                this.app.vent.trigger("hide-right-panel");
            }
        });
        return LeftPanelLayout;
    });
