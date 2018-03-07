define(["jquery",
        "marionette",
        "handlebars",
        'lib/maps/marker-overlays',
        "text!../../templates/left/symbol-set.html",
        "collections/records",
        "collections/symbols"
    ],
    function ($, Marionette, Handlebars, MarkerOverlays, LayerItemTemplate, Records,Symbols) {
        'use strict';
        /**
         * In this view, this.model = Symbol, this.collection = matching Records
         * (One symbol-view is instantiated for each Symbol object).
         * (A symbol-view will display all the markers that match its rules/criteria)
         */
        var SymbolSet =  Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                console.log(this);
                this.createMarkerOverlays();
                this.showOverlays();
                this.listenTo(this.model, "change:title", this.render);
                
            },
            template: Handlebars.compile(LayerItemTemplate),
            tagName: "div",
            templateHelpers: function () {
                console.log(this.model.getModelsJSON())
                console.log(this.model.get('icon'));
                const rule = this.model.get('rule')
                name = this.app.dataManager.getCollection(this.dataSource).name;
                return {
                    name: name,
                    icon: this.model.get('icon'),
                    markerList: this.model.getModelsJSON(),
                    property: rule === '*' ? 'all ' + name : rule
                }
            },
            events: {
                //edit event here, pass the this.model to the right panel
                'click .layer-delete' : 'deleteLayer',
                'change input': 'showHideOverlays',
                'click .symbol-edit': 'showSymbolEditMenu'
            },

            createMarkerOverlays: function() {
                let list = this.model.getModels();
                
                var markerList = new Records(list, {
                    url: "dummy",
                    projectID: this.app.getProjectID()
                });
                this.markerOverlays = new MarkerOverlays({
                    collection: markerList,
                    app: this.app,
                    iconOpts: this.model.toJSON(),
                    isShowing: false
                });
            },

            showSymbolEditMenu: function (event) {
                console.log('child show styebyMenu', this.model);

                const coords = {
                    x: event.clientX,
                    y: event.clientY
                }
                this.app.vent.trigger('show-symbol-menu', this.model, coords, this.layerId);
            },
            showOverlays: function () {
                this.markerOverlays.showAll();
            },

            hideOverlays: function () {
                this.markerOverlays.hideAll();
            },

            deleteOverlays: function () {
                _.each(this.markerOverlayList, function (overlays) {
                    overlays.remove();
                });
            },

            showHideOverlays: function () {
                this.model.get("metadata").isShowing = this.$el.find('input').prop('checked');
                if (this.model.get("metadata").isShowing) {
                    this.showOverlays();
                } else {
                    this.hideOverlays();
                }
            }
        });
        return SymbolSet;
    });
