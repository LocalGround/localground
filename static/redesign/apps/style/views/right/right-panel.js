define(["marionette",
        "handlebars",
        "apps/style/views/right/data-source-view",
        "apps/style/views/right/marker-style-view",
        "apps/style/views/right/filter-rules-view",
        "text!../../templates/right/right-panel-layout.html",
        "models/layer"
    ],
    function (Marionette, Handlebars, DataSourceView, MarkerStyleView, FilterRulesView, RightPanelLayoutTemplate, Layer) {
        'use strict';
        // More info here: http://marionettejs.com/docs/v2.4.4/marionette.layoutview.html
        var RightPanelLayout = Marionette.LayoutView.extend({
            template: Handlebars.compile(RightPanelLayoutTemplate),
            initialize: function (opts) {
                this.app = opts.app;
                this.render();
                this.listenTo(this.app.vent, 'edit-layer', this.createLayer);
            },
            
            events: {
                        //"click .hide-button" : "moveLeftPanel"
                        "click .layer-save" : "saveLayer"
                    },
            
            regions: {
                dataSource: "#data_source_region",
                markerStyle: "#marker_style_region",
                filterRules: "#filter_rules_region"
            },
            onRender: function () {
                // only load views after the LayoutView has
                // been rendered to the screen:
                
                //var dsv = new DataSourceView({ app: this.app });
                //this.dataSource.show(dsv);
                
               // var msv = new MarkerStyleView({ app: this.app });
               // this.markerStyle.show(msv);
               // this.app.vent.trigger("find-datatype");
                
                var frv = new FilterRulesView({ app: this.app });
                this.filterRules.show(frv);
                
                                
            },
            
            createLayer: function (layer) {
                this.model = layer;
                var dsv = new DataSourceView({
                    app: this.app,
                    model: layer
                });
                var msv = new MarkerStyleView({
                    app: this.app,
                    model: layer
                });
                var frv = new FilterRulesView({
                    app: this.app,
                    model: layer
                });
                this.dataSource.show(dsv);
                this.markerStyle.show(msv);
                this.filterRules.show(frv);
                this.app.vent.trigger("re-render");
            },

            saveLayer: function () {
                var title = this.$el.find(".layer-title").val();
                var dataSource;
                var layerType = this.$el.find("#data-type-select").val();
                // get record property?
                var symbolShape = this.$el.find("#quant-shape").val();
                console.log(symbolShape);

                if (this.model.get("filters") === null) {
                    this.model.set("filters", { 'tag' : 'nothing' });
                }

                this.model.set("title", title);
                this.model.set("data_source", dataSource);
                this.model.set("layer_type", layerType);
                // set record property?  
                this.model.set("symbol_shape", symbolShape);
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
        return RightPanelLayout;
    });
