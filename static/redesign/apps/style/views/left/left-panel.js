define(["marionette",
        "handlebars",
        "apps/style/views/left/select-map-view",
        "apps/style/views/left/layer-list-view",
        "apps/style/views/left/skin-view",
        "apps/style/views/left/panel-styles-view",
        "text!../../templates/left/left-panel-layout.html"
    ],
    function (Marionette, Handlebars, SelectMapView, LayerListView, SkinView, PanelStylesView, LeftPanelLayoutTemplate) {
        'use strict';
        // More info here: http://marionettejs.com/docs/v2.4.4/marionette.layoutview.html
        var LeftPanelLayout = Marionette.LayoutView.extend({
            template: Handlebars.compile(LeftPanelLayoutTemplate),
            initialize: function (opts) {
                this.app = opts.app;
                this.render();
            },
            
            events: {
                        "click .hide-button" : "moveLeftPanel",
                        "click .edit" : "showRightPanel",
                        "click #new-layer-options" : "showRightPanel"
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
                var sv = new SelectMapView({ app: this.app });
                this.menu.show(sv);

                var lv = new LayerListView({ app: this.app });
                this.layers.show(lv);
                
                var skv = new SkinView({ app: this.app });
                this.skins.show(skv);
                                
                var ps = new PanelStylesView({ app: this.app });
                this.styles.show(ps);
            },
            moveLeftPanel: function (e) {
                var $btn = $(e.target);
                $btn.toggleClass("map-left-panel-hide", 1000);
                $("#left-panel").toggleClass("left-panel-hide");
              //  $(".hide-panel").toggleClass("tab-fix");
                this.app.vent.trigger("resize-map", "80%");
            },
            showRightPanel: function () {
                console.log("show right panel");
                $("#right-panel").addClass("show-right-panel");
            }
        });
        return LeftPanelLayout;
    });
