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
                console.log("SYMBOL INITIALIZE", this.model.get('title'));
                console.log(this.model.get('isShowing'));
                this.createMarkerOverlays();
                if (this.model.get('isShowing')) {
                    this.showOverlays();
                }
                this.listenTo(this.model, "change:title", this.render);

            },
            onRender: function () {
                console.log('RENDER', this.model);
                if (this.model.get("isShowing")) {
                    this.showOverlays();
                } else {
                    this.hideOverlays();
                }
            },
            template: Handlebars.compile(LayerItemTemplate),
            tagName: "div",
            templateHelpers: function () {
                const rule = this.model.get('rule')
                name = this.collection.name;
                return {
                    name: name,
                    icon: this.model.get('icon'),
                    markerList: this.model.getModelsJSON(),
                    property: rule === '*' ? 'all ' + name : rule,
                    isChecked: this.model.get("isShowing")
                }
            },
            events: {
                //edit event here, pass the this.model to the right panel
                'click .layer-delete' : 'deleteLayer',
                'change .symbol-isShowing': 'showHideOverlays',
                'click .symbol-edit': 'showSymbolEditMenu'
            },
            
            modelEvents: {
                'change:isShowing': 'render'
            },

            createMarkerOverlays: function() {
                this.markerOverlays = new MarkerOverlays({
                    collection: this.model.getModels(),
                    app: this.app,
                    iconOpts: this.model.toJSON(),
                    isShowing: this.model.get('isShowing'),
                    displayOverlays: true
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
                console.log("Show Overlaays");
                this.markerOverlays.showAll();
            },

            hideOverlays: function () {
                console.log("Hide Overlaays");
                this.markerOverlays.hideAll();
            },

            deleteOverlays: function () {
                _.each(this.markerOverlayList, function (overlays) {
                    overlays.remove();
                });
            },

            showHideOverlays: function () {
                console.log('showHideOverlays');
                this.model.set("isShowing", this.$el.find('input').prop('checked'));
                console.log(this.model);
                if (this.model.get("isShowing")) {
                    //this.showOverlays();
                } else {
                    //this.hideOverlays();
                }
                this.model.trigger('show-hide-symbol');
                //this.model.save();
            },
            onDestroy: function () {
                this.hideOverlays();
            }
        });
        return SymbolSet;
    });
