define(["marionette",
        "handlebars",
        "apps/style/views/left/select-map-view",
        "apps/style/views/left/layer-list-view",
        "apps/style/views/left/skin-view",
        "apps/style/views/left/panel-styles-view",
        "text!../../templates/left/left-panel-layout.html",
        "models/layer"
    ],
    function (Marionette, Handlebars, SelectMapView, LayerListView, SkinView, PanelStylesView, LeftPanelLayoutTemplate, Layer) {
        'use strict';
        // More info here: http://marionettejs.com/docs/v2.4.4/marionette.layoutview.html
        var LeftPanelLayout = Marionette.LayoutView.extend({
            template: Handlebars.compile(LeftPanelLayoutTemplate),
            initialize: function (opts) {
                this.app = opts.app;
                this.render();
                this.listenTo(this.app.vent, 'change-map', this.handleNewMap);
            },
            
            events: {
                        "click .hide-button" : "moveLeftPanel",
                        "click .edit" : "showRightPanel",
                      //  "click #new-layer-options a" : "showRightPanel",
                        "click #new-layer-options a" : "createNewLayer"
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
            handleNewMap: function(mapModel) {
                this.mapModel = mapModel;
                var ps = new PanelStylesView({
                    app: this.app,
                    model: mapModel
                });
                this.styles.show(ps); 
            },
            moveLeftPanel: function (e) {
                var $btn = $(e.target);
                $btn.toggleClass("map-left-panel-hide", 1000);
                $("#left-panel").toggleClass("left-panel-hide");
                this.app.vent.trigger("resize-map", "80%");
            },
            showRightPanel: function () {
                $("#right-panel").addClass("show-right-panel");
            },
            createNewLayer: function (e) {
                this.showRightPanel();
                var $selection = $(e.target).attr("data-value");
                var layer = new Layer ({
                    map_id: this.mapModel.id,
                    data_source: $selection,
                    layer_type: "categorical",
                    symbols: [{
                        "color": "#7075FF",
                        "width": 30,
                        "rule": "sculptures > 0",
                        "title": "At least 1 sculpture"
                    }],
                    title: "untitled"
                    
                });
                console.log(layer);
                this.app.vent.trigger("create-layer", layer);
            }
        });
        return LeftPanelLayout;
    });
