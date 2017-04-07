define(["jquery",
        "marionette",
        "handlebars",
        "apps/style/views/left/select-map-view",
        "apps/style/views/left/layer-list-view",
        "apps/style/views/left/skin-view",
        "apps/style/views/left/panel-styles-view",
        "text!../../templates/left/left-panel-layout.html"
    ],
    function ($, Marionette, Handlebars, SelectMapView, LayerListView, SkinView, PanelStylesView, LeftPanelLayoutTemplate) {
        'use strict';
        // More info here: http://marionettejs.com/docs/v2.4.4/marionette.layoutview.html
        var LeftPanelLayout = Marionette.LayoutView.extend({
            template: Handlebars.compile(LeftPanelLayoutTemplate),

            initialize: function (opts) {
                /*This Layout View relies on a Map model which gets set from the change-map event, 
                which is triggered from the select-map-view.js */
                this.app = opts.app;
                this.render();
                this.listenTo(this.app.vent, 'change-map', this.handleNewMap);
                this.listenTo(this.app.vent, 'edit-layer', this.showRightPanel);
                this.listenTo(this.app.vent, 'add-layer', this.showRightPanel);
            },
            events: {
                "click #new-layer-options a" : "createNewLayer",
                'click .hide': 'hidePanel',
                'click .show': 'showPanel',
                "click .map-save" : "saveMap"
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
                var sv, lv, skv, ps;
                sv = new SelectMapView({ app: this.app });
                this.menu.show(sv);

                lv = new LayerListView({ app: this.app });
                this.layers.show(lv);

                skv = new SkinView({ app: this.app });
                this.skins.show(skv);

                ps = new PanelStylesView({ app: this.app });
                this.styles.show(ps);
            },
            handleNewMap: function (model) {
                this.app.selectedMapModel = model;
                var ps = new PanelStylesView({
                    app: this.app,
                    model: model
                });
                this.styles.show(ps);
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
                console.log(JSON.stringify(this.model.toJSON(), null, 2));
               // this.model.set("basemap", 1);
                this.model.save({
                    error: function () {
                        console.log('error');
                    },
                    success: function () {
                        console.log('success');
                    }
                });
            }
        });
        return LeftPanelLayout;
    });
