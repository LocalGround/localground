define(["jquery",
        "marionette",
        "handlebars",
        'lib/maps/marker-overlays',
        "text!../../templates/left/symbol-set.html",
        "collections/symbols"
    ],
    function ($, Marionette, Handlebars, MarkerOverlays, LayerItemTemplate, Symbols) {
        'use strict';
        /**
         * In this view, this.model = Symbol, this.collection = matching Records
         * (One symbol-view is instantiated for each Symbol object).
         * (A symbol-view will display all the markers that match its rules/criteria)
         */
        var SymbolSet =  Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
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
            showSymbolEditMenu: function (event) {
                console.log('child show styebyMenu', this.model);

                const coords = {
                    x: event.clientX,
                    y: event.clientY
                }
                this.app.vent.trigger('show-symbol-menu', this.model, coords, this.layerId);
            },
        });
        return SymbolSet;
    });
