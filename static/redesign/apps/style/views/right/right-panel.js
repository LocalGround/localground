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
                _.extend(this, opts);
                this.render();
                this.listenTo(this.app.vent, 'edit-layer', this.createLayer);
                this.listenTo(this.app.vent, 'hide-right-panel', this.hidePanel);
            },

            events: {
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

                var frv = new FilterRulesView({ app: this.app });
                this.filterRules.show(frv);

            },

            createLayer: function (layer, collection) {
                console.log("right panel createLayer() triggered. 1. layer, 2. collection", layer, collection);
                this.triggerShowPanel();
                this.model = layer;
                this.collection = collection;
                var dsv = new DataSourceView({
                    app: this.app,
                    model: this.model
                });
                this.msv = new MarkerStyleView({
                    app: this.app,
                    model: this.model
                });
                this.frv = new FilterRulesView({
                    app: this.app,
                    model: this.model
                });
                this.dataSource.show(dsv);
                this.markerStyle.show(this.msv);
                this.filterRules.show(this.frv);
                this.app.vent.trigger("re-render");
                this.updateSourceCode();
                this.saveLayer();
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
                var that = this;
                var title = this.$el.find(".layer-title").val(),
                    dataSource = this.$el.find(".selected-data-source").val(),
                    layerType = this.$el.find("#data-type-select").val(), 
                    buckets = this.$el.find("#bucket").val();
                if (this.model.get("filters") === null) {
                    console.log("accounting for no filters");
                    this.model.set("filters", { 'tag' : 'nothing' });
                }
                if (!this.model.get('symbols').length) {
                    console.log("Layer will not save because symbols do not exist");
                    this.app.vent.trigger('update-data-source');
                }
               // this.model.set("title", title);
               // this.model.set("data_source", dataSource);
                this.model.set("layer_type", layerType);
                console.log("saveLayer() triggered", this.model.toJSON());
                console.log(this.model.urlRoot);

                this.model.save(null, {
                    error: function (model, response) {
                        var messages = JSON.parse(response.responseText);
                        console.log('error', messages);
                        if (messages.non_field_errors) {
                            alert("You have already used the title '" + that.model.get("title") +
                            "' for another layer. Please choose a different title.");
                        }
                    },
                    success: function () {
                        console.log('success');
                        that.collection.add(that.model);
                        that.app.layerHasBeenSaved = true;
                        that.app.layerHasBeenAltered = false;
                    }
                });
            },
            triggerShowPanel: function () {
                this.app.vent.trigger('unhide-detail');
                this.$el.find('.right-panel-btn').show();
            },
            hidePanel: function (e) {
                $(".right-panel-button").removeClass("hide").addClass("show");
                this.app.vent.trigger('hide-detail');
                if(e) {
                    e.preventDefault();
                }
            },
            showPanel: function (e) {
                $(e.target).removeClass("show").addClass("hide");
                this.app.vent.trigger('unhide-detail');
                e.preventDefault();
            }
        });
        return RightPanelLayout;
    });
