define(["jquery",
        "marionette",
        "handlebars",
        "apps/style/views/right/data-source-view",
        "apps/style/views/right/marker-style-view",
        "apps/style/views/right/source-code-style-view",
        "apps/style/views/right/filter-rules-view",
        "text!../../templates/right/right-panel-layout.html"
    ],
    function ($, Marionette, Handlebars, DataSourceView, MarkerStyleView, SourceCodeStyleView, FilterRulesView, RightPanelLayoutTemplate) {
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
                "click .style-basic-tab" : "showMarkerStyleRegion",
                'click .hide': 'hidePanel',
                'click .show': 'showPanel'
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
                this.triggerShowPanel();
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
                this.updateSourceCode();
            },

            updateSourceCode: function () {
                if (this.sourceCode) {
                    this.sourceCode.model = this.model;
                    this.sourceCode.render();
                } else {
                    this.sourceCode = new SourceCodeStyleView({
                        app: this.app,
                        model: this.model
                    });
                }
            },

            showSourceRegion: function () {
                if (this.sourceCodeStyle.$el) {
                    this.sourceCodeStyle.$el.show();
                } else {
                    this.sourceCodeStyle.show(this.sourceCode);
                }
                if (this.markerStyle.$el) {
                    this.markerStyle.$el.hide();
                }
            },

            showMarkerStyleRegion: function () {
                if (this.sourceCodeStyle.$el) {
                    this.sourceCodeStyle.$el.hide();
                }
                this.markerStyle.$el.show();
            },

            saveLayer: function () {
                var title = this.$el.find(".layer-title").val(),
                    dataSource = this.$el.find("#data_source").val(),
                    layerType = this.$el.find("#data-type-select").val();
                if (this.model.get("filters") === null) {
                    this.model.set("filters", { 'tag' : 'nothing' });
                }
                this.model.set("title", title);
                this.model.set("data_source", dataSource);
                this.model.set("layer_type", layerType);
                this.model.save(null, {
                    error: function () {
                        console.log('error');
                    },
                    success: function () {
                        console.log('success');
                    }
                });
            },
            triggerShowPanel: function () {
                this.app.vent.trigger('unhide-detail');
                this.$el.find('.right-panel-btn').show();
            },
            hidePanel: function (e) {
                $(e.target).removeClass("hide").addClass("show");
                this.app.vent.trigger('hide-detail');
                e.preventDefault();
            },
            showPanel: function (e) {
                $(e.target).removeClass("show").addClass("hide");
                this.app.vent.trigger('unhide-detail');
                e.preventDefault();
            }
        });
        return RightPanelLayout;
    });
