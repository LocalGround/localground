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
                if (!this.model) {
                    alert('a model is required');
                }
                this.app.vent.trigger('add-css-to-selected-layer', this.model.id);
                this.listenTo(this.app.vent, 'hide-right-panel', this.hidePanel);
                this.listenTo(this.app.vent, 'update-data-source', this.initialize);
            },

            events: {
                "click .layer-save" : "saveLayer",
                "click .style-source-tab" : "showSourceRegion",
                "click .style-basic-tab" : "showMarkerStyleRegion",
                'click .hide': 'hidePanel',
                'click .show': 'showPanel'
            },

            modelEvents: {
                'change:data_source': 'createMSV'
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
                this.createLayer();
                var frv = new FilterRulesView({ app: this.app });
                this.filterRules.show(frv);

            },

            createMSV: function () {
                var msv = new MarkerStyleView({
                    app: this.app,
                    model: this.model
                });
                this.getRegion('markerStyle').show(msv);
            },

            createDSV: function () {
                var msv = new MarkerStyleView({
                    app: this.app,
                    model: this.model
                });
                
            },

            createSCSV: function () {
                var scsv = new SourceCodeStyleView({
                    app: this.app,
                    model: this.model
                });
                this.getRegion('sourceCodeStyle').show(scsv);
            },

            createLayer: function (layer, collection) {
                this.triggerShowPanel();
              //  this.model = layer;
              //  this.collection = collection;
                var dsv = new DataSourceView({
                    app: this.app,
                    model: this.model
                });
                var frv = new FilterRulesView({
                    app: this.app,
                    model: this.model
                });
                
                this.dataSource.show(dsv);
                this.createMSV();
                this.createSCSV();
//                this.updateSourceCode();
                if(!this.model.id) {
                    this.saveLayer();
                }
            },

            showSourceRegion: function () {
                if (this.markerStyle.$el) {
                    this.markerStyle.$el.hide();
                }
                this.sourceCodeStyle.$el.show();
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
                    this.model.set("filters", { 'tag' : 'nothing' });
                }
                if (!this.model.get('symbols').length) {
                    this.app.vent.trigger('update-data-source');
                }
                this.model.set("layer_type", layerType);
                this.model.set('newLayer', false);

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
                        console.log('success', that.model);
                        that.collection.add(that.model);
                        that.app.vent.trigger('add-css-to-selected-layer', that.model.id);
                        that.app.router.navigate('//' + that.model.get('map_id') + '/layers/' + that.model.id);
                        that.app.layerHasBeenSaved = true;
                        that.app.layerHasBeenAltered = false;
                    }
                });
            },
            triggerShowPanel: function () {
                this.showPanel();
                this.$el.find('.right-panel-btn').show();
            },
            hidePanel: function (e) {
                $('#right-panel .show-hide').removeClass("hide").addClass("show");
                this.app.vent.trigger('hide-detail');
                if (e) {
                    e.preventDefault();
                }
            },
            showPanel: function (e) {
                $('#right-panel .show-hide').removeClass("show").addClass("hide");
                this.app.vent.trigger('unhide-detail');
                if (e) {
                    e.preventDefault();
                }
            }
        });
        return RightPanelLayout;
    });
