define(["marionette",
        "handlebars",
        "apps/style/views/select-map-view",
        "apps/style/views/layer-list-view",
        "apps/style/views/skin-view",
        "text!../templates/panel-styles.html",
        "text!../templates/left-panel-layout.html"
    ],
    function (Marionette, Handlebars, SelectMapView, LayerListView, SkinView, PanelStylesTemplate, LeftPanelLayoutTemplate) {
        'use strict';
        // More info here: http://marionettejs.com/docs/v2.4.4/marionette.layoutview.html
        var LeftPanelLayout = Marionette.LayoutView.extend({
            template: Handlebars.compile(LeftPanelLayoutTemplate),
            initialize: function (opts) {
                this.app = opts.app;
                this.render();
            },
            
            events: {
                        "click .hide-button" : "moveLeftPanel"
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
                var sv = new SelectMapView({ app: this });
                this.menu.show(sv);

                var lv = new LayerListView({ app: this });
                this.layers.show(lv);
                
                var skv = new SkinView({ app: this });
                this.skins.show(skv);
                                
                this.styles = PanelStylesTemplate;
            },
            moveLeftPanel: function () {
                $("#left-panel").toggleClass("left-panel-hide");
            }
        });
        return LeftPanelLayout;
    });
