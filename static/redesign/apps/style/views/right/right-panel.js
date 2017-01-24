define(["marionette",
        "handlebars",
        "apps/style/views/right/data-source-view",
        "apps/style/views/right/marker-style-view",
        "apps/style/views/right/filter-rules-view",
        "text!../../templates/right/right-panel-layout.html"
    ],
    function (Marionette, Handlebars, DataSourceView, MarkerStyleView, FilterRulesView, RightPanelLayoutTemplate) {
        'use strict';
        // More info here: http://marionettejs.com/docs/v2.4.4/marionette.layoutview.html
        var RightPanelLayout = Marionette.LayoutView.extend({
            template: Handlebars.compile(RightPanelLayoutTemplate),
            initialize: function (opts) {
                this.app = opts.app;
                this.render();
            },
            
            events: {
                        //"click .hide-button" : "moveLeftPanel"
                    },
            
            regions: {
                dataSource: "#data_source_region",
                markerStyle: "#marker_style_region",
                filterRules: "#filter_rules_region"
            },
            onRender: function () {
                // only load views after the LayoutView has
                // been rendered to the screen:
                
                var dsv = new DataSourceView({ app: this.app });
                this.dataSource.show(dsv);
                
                var msv = new MarkerStyleView({ app: this.app });
                this.markerStyle.show(msv);
                this.app.vent.trigger("find-datatype");
                
                var frv = new FilterRulesView({ app: this.app });
                this.filterRules.show(frv);
                
                                
            }
        });
        return RightPanelLayout;
    });
