const ModelMixins = {
    // observers: [],

    notifyAll: () => {
        for (const observer of this.observers) {
            observer.update(this);
        }
    },

    registerObserver: (observer) => {
        this.observers.push(observer);
    }
}

class MapModel {
    observers;
    constructor (mapJSON) {
        Object.assign(this, ModelMixins);
        this.observers = [];

        this.center = mapJSON.center;
        this.basemap = mapJSON.basemap;
        this.zoom = mapJSON.zoom;
        this.name = mapJSON.name;
        
        // TODO: convert to collections
        this.layers = mapJSON.layers;
        this.datasets = mapJSON.datasets;
        this.media = mapJSON.media;
    }
}

class LayerModel {

    observers;
    constructor (layerJSON) {
        //Object.assign(this, ModelMixins);
        this.observers = [];

        this.id = layerJSON.id;
        this.title = layerJSON.title;
        this.dataset = layerJSON.dataset;
	    this.symbols = layerJSON.symbols;
        this.isShowing = layerJSON.isShowing;
        this.symbols = layerJSON.symbols;
    }

    notifyAll () {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }

    registerObserver (observer) {
        this.observers.push(observer);
    }
}