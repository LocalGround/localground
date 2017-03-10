define(["marionette",
        "handlebars",
        "apps/style/views/right/data-source-view",
        "apps/style/views/right/marker-style-view",
        "apps/style/views/right/source-code-style-view",
        "apps/style/views/right/filter-rules-view",
        "text!../../templates/right/right-panel-layout.html",
        "models/layer"
    ],
    function (Marionette, Handlebars, DataSourceView, MarkerStyleView, SourceCodeStyleView, FilterRulesView, RightPanelLayoutTemplate, Layer) {
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
                        "click .layer-save" : "saveLayer",
                        "click .style-source-tab" : "showSourceRegion",
                        "click .style-basic-tab" : "showMarkerStyleRegion"
                    },
            
            regions: {
                dataSource: "#data_source_region",
                markerStyle: "#marker_style_region",
                sourceCodeStyle: "#source_code_style_region",
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
                this.msv = new MarkerStyleView({
                    app: this.app,
                    model: layer
                });
                this.frv = new FilterRulesView({
                    app: this.app,
                    model: layer
                });
                this.dataSource.show(dsv);
                this.markerStyle.show(this.msv);
                this.filterRules.show(this.frv);
                this.app.vent.trigger("re-render");
            },

            showSourceRegion() {
                this.markerStyle.$el.hide();
                
                if (!this.sourceCode) {
                    this.sourceCode = new SourceCodeStyleView({
                        app: this.app,
                        model: this.model
                    });
                    this.sourceCodeStyle.show(this.sourceCode);
                } else {
                    this.sourceCodeStyle.$el.show();
                }
            },

            showMarkerStyleRegion() {
                this.sourceCodeStyle.$el.hide();
                this.markerStyle.$el.show();
            },

            saveLayer: function () {
                var title = this.$el.find(".layer-title").val();
                var dataSource;
                var layerType = this.$el.find("#data-type-select").val();
                // get record property?
                var symbolShape = this.$el.find("#quant-shape").val();
                var sourceCode = JSON.parse(this.$el.find(".source-code").val());
                console.log(symbolShape);

                if (this.model.get("filters") === null) {
                    this.model.set("filters", { 'tag' : 'nothing' });
                }
                this.model.set("title", title);
                this.model.set("data_source", dataSource);
                this.model.set("layer_type", layerType);
                this.model.set("symbols", sourceCode);
                // set record property?  
                this.model.set("symbol_shape", symbolShape);
                console.log(this.model.toJSON());
                this.model.save(null, {
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
