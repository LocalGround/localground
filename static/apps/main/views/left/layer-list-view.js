define(["marionette",
        "handlebars",
        "apps/main/views/left/layer-list-child-view1",
        "text!../../templates/left/layer-list.html"
    ],
    function (Marionette, Handlebars, LayerListChild,
        LayerListTemplate) {
        'use strict';
        /**
         *  In this view, this.model = Map, this.collection = Layers
         *  This view handles instantiation of LayerListChildView and
         * MarkerStyleView
         */
        var LayerListView = Marionette.CompositeView.extend(_.extend({}, {
            template: Handlebars.compile(LayerListTemplate),
            templateHelpers: function () {
                return {
                    noLayers: (this.collection.length === 0)
                };
            },
            isShowing: true,
            childView: LayerListChild,
            childViewContainer: "#layers",

            initialize: function (opts) {
                // In this view, this.model = the selected map,
                // this.collection = all the map's layers
                this.app = opts.app;
                this.model = opts.model;
                this.modal = this.app.modal;
                this.listenTo(this.app.vent, 'update-layer-list', this.render);
                this.listenTo(this.app.vent, 'add-css-to-selected-layer', this.addCssToSelectedLayer);
            },

            childViewOptions: function (model, index) {
                const dm = this.app.dataManager;
                console.log(model);
                return {
                    app: this.app,
                    collection: model.get('symbols'),
                    dataCollection: dm.getCollection(model.get('dataset').overlay_type)
                };
            },

            // this just adds some css to indicate the selected layer
            addCssToSelectedLayer: function (id) {
                this.$el.find('.layer-column').removeClass('selected-layer');
                this.$el.find('#' +'layer' + id).addClass('selected-layer');
            },

            onDestroy: function() {
                console.log('DESTROYING>>>');
                if (this.menu) {
                    this.menu.destroy();
                }
            },

        }));
        return LayerListView;
    });
