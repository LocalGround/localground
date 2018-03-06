define(["jquery",
        "marionette",
        "handlebars",
        'lib/maps/marker-overlays',
        "text!../../templates/left/symbol-set.html",
        "collections/symbols"
    ],
    function ($, Marionette, Handlebars, MarkerOverlays, LayerItemTemplate, Symbols) {
        'use strict';
        var SymbolSet =  Marionette.ItemView.extend({
            initialize: function (opts) {
                // One symbol-view is instantiated for each Symbol object.
                // A symbol-view will display all the markers that match its rules/criteria
                console.log('opts: ', opts);
                _.extend(this, opts);
                //this.listenTo(this.app.vent, "change-map", this.hideOverlays);
                this.listenTo(this.model, "change:title", this.render);
               // this.listenTo(this.app.vent, "route-layer", this.routerSendCollection);
                //this.initMapOverlays();
                // if (this.model.get("metadata").isShowing) {
                //     this.showOverlays();
                // }
                console.log('symbol view initlize');
                //this.dataset = this.app.dataManager.getCollection(this.model.get('data_source'));
                this.markerList = this.buildMarkerList(this.model, this.dataSource);                
            },
            template: Handlebars.compile(LayerItemTemplate),
            tagName: "div",
            templateHelpers: function () {
                console.log(this.model.get('icon'));
                const rule = this.model.get('rule')
                name = this.app.dataManager.getCollection(this.dataSource).name;
                return {
                    name: name,
                    icon: this.model.get('icon'),
                    markerList: this.markerList,
                    property: rule === '*' ? 'all ' + name : rule
                }
            },
         //   className: "layer-column",
            // templateHelpers: function () {
            //     let defaultField = this.dataset.fields ? this.dataset.fields.models[1].get('col_name') : 'id'; 
            //     let simpleDataset = this.dataset.models.map(item => {
            //         return {
            //             property: item.get(defaultField),
            //             id: item.get('id')
            //         }
            //     });
            //     console.log(defaultField);
            //     console.log(simpleDataset);
            //     return {
            //         name: this.dataset.name,
            //         //dataList: simpleDataset,
            //         isChecked: this.model.get("metadata").isShowing
            //     };
            // },
            buildMarkerList: function (symbol, dataSource) {
                let dataset = this.app.dataManager.getCollection(dataSource);
                let matchedCollection = [];
                dataset.each(function (model) {
                    //console.log("symbol looped once", symbol.checkModel(model));
                    if (symbol.checkModel(model)) {
                        matchedCollection.push(model);
                    }
                });
                console.log(matchedCollection);
                return matchedCollection;

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
