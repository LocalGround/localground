define(["underscore",
        "jquery",
        "marionette",
        "handlebars",
        "apps/main/views/left/map-title-view",
        "apps/main/views/left/layer-list-view",
        "text!../../templates/left/left-panel-layout.html"
    ],
    function (_, $, Marionette, Handlebars, MapTitleView, LayerListView, LeftPanelLayoutTemplate) {
        'use strict';
        // More info here: http://marionettejs.com/docs/v2.4.4/marionette.layoutview.html
        var LeftPanelLayout = Marionette.LayoutView.extend({
            template: Handlebars.compile(LeftPanelLayoutTemplate),

            initialize: function (opts) {
                _.extend(this, opts);
                this.listenTo(this.app.vent, 'new-layer-added', this.scrollToLayer);
            },
            events: {
                'click .map-save' : 'saveMap',
                'click #map-delete': 'deleteMap',
                'click .show-hide': 'toggleList'
            },

            regions: {
                menu: "#map_title",
                layers: "#layers_region"
            },
            onRender: function () {
                this.menu.show(new MapTitleView({
                    app: this.app,
                    model: this.model
                }));
                this.layers.show(new LayerListView({
                    app: this.app,
                    model: this.model,
                    collection: this.model.getLayers()
                }));
            },

            saveMap: function () {
                this.model.set("zoom", this.app.getZoom());
                this.model.set("center", this.app.getCenter());
                this.model.set("basemap", this.app.getMapTypeId());
                this.model.save({
                    error: function () {
                        console.error('error');
                    },
                    success: function () {
                        console.log('success');
                    }
                });
            },

            deleteMap: function () {
                if (!confirm("Are you sure you want to delete this map?")) {
                    return;
                }
                this.app.dataManager.destroyMap(this.model);
                this.app.router.navigate('//');

            },
            toggleList: function (e) {
                if (e.srcElement.classList.contains('hide')) {
                    this.app.vent.trigger('hide-list');
                } else {
                    this.app.vent.trigger('unhide-list');
                }
                e.srcElement.classList.toggle('hide');
                e.srcElement.classList.toggle('show');
            },

            scrollToLayer: function (layerModel) {
                const $domElement = $('#' + 'layer' + layerModel.id);
                const layerHeight = $domElement.parent().parent().height();
                const panelHeight = this.layers.$el.find('.layers').height();
                this.layers.$el.animate({
                    scrollTop: panelHeight - layerHeight
                });
            },
        });
        return LeftPanelLayout;
    });
