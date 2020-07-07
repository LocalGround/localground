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
        this.initLayers(Object.values(mapJSON.layers));
        this.datasets = mapJSON.datasets;
        this.media = mapJSON.media;
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
        this.initSymbols(Object.values(layerJSON.symbols));
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
}

class SymbolModel {

    constructor (layerModel, symbolJSON) {
        Object.assign(this, ModelMixins);
        this.observers = [];

        this.id = symbolJSON.id;
        
        this.title = symbolJSON.title;
        this.isShowing = symbolJSON.isShowing;
        this.rule = symbolJSON.rule;
        
        this.svg = symbolJSON.svg;
        this.iconAnchor = symbolJSON.iconAnchor;
        this.iconSize = symbolJSON.iconSize;
        this.popupAnchor = symbolJSON.popupAnchor;

        // from the layer model:
        this.layerID = layerModel.id;
        this.isExpanded = layerModel.isExpanded;

        this.initRecords(Object.values(symbolJSON.records));
    }

    initRecords (recordsJSON) {
        this.records = [];
        for (const recordJSON of recordsJSON) {
            this.records.push(new RecordModel(recordJSON, [], this));
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
    constructor (recordJSON, fieldsJSON, symbolModel) {
        Object.assign(this, ModelMixins);
        Object.assign(this, recordJSON);
        this.isActive = false;
        this.observers = [];

        this.symbolModel = symbolModel;
        this.fields = fieldsJSON;

    }

    setIsActive (isActive) {
        this.isActive = isActive;
        this.notifyAll();
    }

    getIcon () {
        return this.symbolModel.getIcon();
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

    getLatLng () {
        return [
            this.geometry.coordinates[1],
            this.geometry.coordinates[0]
        ];
    }
}