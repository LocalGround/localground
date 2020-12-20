const ModelMixins = {
    // Note: 
    //  a) don't use arrow functions b/c lose the scope of "this"
    //  b) observers array needs to be initialized in the constructor
    
    notifyAll: function () {
        for (const observer of this.observers) {
            observer.update(this);
        }
    },

    registerObserver: function (observer)  {
        this.observers.push(observer);
    }
}

class MapModel {

    constructor (mapJSON) {
        Object.assign(this, ModelMixins);
        this.observers = [];

        this.center = mapJSON.center;
        this.basemap = mapJSON.basemap;
        this.zoom = mapJSON.zoom;
        this.name = mapJSON.name;
        this.legendIsMinimized = false;
        
        // TODO: convert to collections
        this.initLayers(mapJSON.layers);
        this.datasets = mapJSON.datasets;
        this.media = mapJSON.media;
        if (mapJSON.title_card) {
            this.titleCard = new RecordModel({
                recordJSON: mapJSON.title_card, 
                datasetJSON: [], 
                symbolModel: null
            });
        }
    }

    getRecords () {
        const reducer = (accumulator, currentLayer) => {
            if (!Array.isArray(accumulator)) {
                accumulator = accumulator.getRecords();
            }
            return accumulator.concat(currentLayer.getRecords())
        };
        return this.layers.length === 1 ? 
            this.layers[0].getRecords() : this.layers.reduce(reducer);
    }

    initLayers (layersJSON) {
        this.layers = [];
        for (const layerJSON of layersJSON) {
            this.layers.push(new LayerModel(layerJSON));
        }
    }
}

class LayerModel {

    constructor (layerJSON) {
        Object.assign(this, ModelMixins);
        this.observers = [];

        this.id = layerJSON.id;
        this.title = layerJSON.title;
        this.dataset = layerJSON.dataset;
	    this.symbols = layerJSON.symbols;
        this.isShowing = layerJSON.isShowing;
        this.isExpanded = false;

        // create a collection:
        this.initSymbols(layerJSON.symbols);
    }

    setIsExpanded (isExpanded) {
        this.isExpanded = isExpanded;
        for (const symbol of this.symbols) {
            symbol.isExpanded = isExpanded;
            symbol.notifyAll();
        }
        this.notifyAll();
    }

    setIsShowing (isShowing) {
        this.isShowing = isShowing;
        for (const symbol of this.symbols) {
            symbol.setIsShowing(isShowing);
        }
        this.notifyAll();
    }

    initSymbols (symbolsJSON) {
        this.symbols = [];
        for (const symbolJSON of symbolsJSON) {
            this.symbols.push(new SymbolModel(this, symbolJSON));
        }
    }
    getRecords () {
        const reducer = (accumulator, currentSymbol) => {
            if (!Array.isArray(accumulator)) {
                accumulator = accumulator.records;
            }
            return accumulator.concat(currentSymbol.records)
        };
        return this.symbols.length === 1 ? 
            this.symbols[0].records : this.symbols.reduce(reducer);
    }
}

class SymbolModel {

    constructor (layerModel, symbolJSON) {
        Object.assign(this, ModelMixins);
        this.observers = [];
        this.layerModel = layerModel;
        this.id = symbolJSON.id;
        
        this.title = symbolJSON.title;
        this.isShowing = symbolJSON.isShowing;
        this.rule = symbolJSON.rule;
        
        this.svg = symbolJSON.svg;
        this.svg_legend = symbolJSON.svg_legend;
        this.iconAnchor = symbolJSON.iconAnchor;
        this.iconSize = symbolJSON.iconSize;
        this.popupAnchor = symbolJSON.popupAnchor;


        this.fillColor = symbolJSON.fillColor;
        this.strokeColor = symbolJSON.strokeColor,
        this.strokeWeight = symbolJSON.strokeWeight,
        this.fillOpacity = symbolJSON.fillOpacity,
        this.strokeOpacity = symbolJSON.strokeOpacity;

        // from the layer model:
        this.layerID = layerModel.id;
        this.isExpanded = layerModel.isExpanded;

        this.initRecords(symbolJSON.records);
    }

    getDataset () {
        return this.layerModel.dataset;
    }

    getRecords () {
        return this.records;
    }

    initRecords (recordsJSON) {
        this.records = [];
        for (const recordJSON of recordsJSON) {
            this.records.push(new RecordModel({
                recordJSON: recordJSON, 
                datasetJSON: this.getDataset(), 
                symbolModel: this
            }));
        }
    }

    setIsShowing (isShowing) {
        this.isShowing = isShowing;
        for (const record of this.records) {
            record.notifyAll();
        }
        this.notifyAll();
    }

    getIcon () {
        return L.icon({
            iconUrl: encodeURI("data:image/svg+xml," + this.svg).replace(/#/g,'%23'),
            iconSize: this.iconSize,
            iconAnchor: this.iconAnchor,
            popupAnchor: this.popupAnchor
        });
    }

}

class RecordModel {
    constructor (opts) {
        Object.assign(this, ModelMixins);
        Object.assign(this, opts.recordJSON);
        this.isActive = false;
        this.observers = [];

        this.applyTitleCardCrosswalk();

        this.symbolModel = opts.symbolModel;
        this.dataset = opts.datasetJSON;
        console.log(this.geometry);
    }

    applyTitleCardCrosswalk () {
        // if (this.media) {
        //     this.attached_photos_videos = this.media;
        // }
        if (this.header) {
            this.name = this.display_value = this.header;
        }
    }

    setIsActive (isActive) {
        this.isActive = isActive;
        this.notifyAll();
    }

    getCoordinates() {
        if (!this.hasGeometry()) {
            return;
        }
        if (this.isPoint()) {
            return [
                this.geometry.coordinates[1],
                this.geometry.coordinates[0]
            ];
        }

        let sourceCoords = this.geometry.coordinates;
        if (this.isPolygon()) {
            sourceCoords = sourceCoords[0];
        }
        const coords = [];
        for (const coord of sourceCoords) {
            coords.push([coord[1], coord[0]]);
        }
        return coords;
    }

    getIcon () {
        return this.symbolModel.getIcon();
    }

    hasGeometry() {
        return this.geometry != null;
    }

    isPoint () {
        return this.geometry ? this.geometry.type === 'Point' : false;
    }

    isPolyline() {
        return this.geometry ? this.geometry.type === 'LineString' : false;
    }

    isPolygon () {
        return this.geometry ? this.geometry.type === 'Polygon' : false;
    }
    isShowing () {
        return this.symbolModel.isShowing;
    }

    getThumbnail () {
        for (const media of this.attached_photos_videos) {
            if (media.overlay_type === 'photo') {
                return media.path_small;
            }
        }
    }

}