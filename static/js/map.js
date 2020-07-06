class Map {

    markerLayers = {};
    map;
    oms;
    mapData;
    childViews = [];

    constructor (mapJSON) {
        Object.assign(this, mixins);

        this.mapData = mapJSON;
        this.model = new MapModel(mapJSON);
        // this.model.observers.push(this);
        this.drawMap();
        this.renderData();
        this.addEventListeners();
    }

    addEventListeners () {
        // document.addEventListener("toggle-layer-visibility", this.toggleLayerVisibility.bind(this));
        // document.addEventListener("toggle-symbol-visibility", this.toggleSymbolVisibility.bind(this));
        document.addEventListener("set-active-record", this.setActiveRecord.bind(this));
        document.addEventListener("refactor-map-bounds", this.map.invalidateSize.bind(this));
    }

    setActiveRecord (ev) {
        // const item = marker.item;
        // this.model.photos = [];
        // if (this.model.attached_photos_videos) {
        //     for (const media of this.model.attached_photos_videos) {
        //         if (media.overlay_type === 'photo') {
        //             const photo = this.model.media.photos[media.id];
        //             this.model.photos.push(photo);
        //         }
        //     }
        // }
        if (this.selectedRecord) {
            this.selectedRecord.setIsActive(false);
        }
        this.selectedRecord = ev.detail.recordModel;
        this.selectedRecord.setIsActive(true);
        const latLng = this.selectedRecord.getLatLng();
        setTimeout((() => { 
            this.map.invalidateSize()
            this.map.setView(latLng); 
        }).bind(this), 10);

        // Card right-hand side:
        this.selectedRecord.photos = [];
        const card = new Card(this.selectedRecord);
        document.querySelector('main').classList.add('with-card');
        card.addCardToDOM('#card-holder')

        // Trigger popup:
        if (ev.detail.triggerPopup) {
            setTimeout((() => {
                L.popup()
                .setLatLng(latLng)
                .setContent(this.selectedRecord.name)
                .openOn(this.map)
            }).bind(this), 10);
        }
    };

    drawMap () {	
    
        document.querySelector('header h1').innerHTML = this.model.name;
        //Stamen Toner tiles attribution and URL
        const tilesets = {
            'toner-lite': {
                'url': 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}',
                'subdomains': 'abcd'
            },
            'watercolor': {
                'url': 'http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}',
                'subdomains': 'abcd'
            },
            'toner-background': {
                'url': 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.{ext}',
                'subdomains': 'abcd'
            }
        }
        // set tileset; default to toner
        let tileset = tilesets[this.mapData.basemap];
        if (!tileset) {
            tileset = tilesets['toner-lite'];
        }
        var basemapURL = tileset.url
        var basemap = L.tileLayer(basemapURL, {
            subdomains: tileset.subdomains,
            minZoom: 0,
            maxZoom: 20,
            ext: 'png'
        });
        const center = this.mapData.center.coordinates;
        this.map = L.map('mapid', {
            layers: [basemap],
            trackResize: true
        }).setView([center[1], center[0]], this.mapData.zoom);

        // Add marker clustering control: 
        this.oms = new OverlappingMarkerSpiderfier(this.map);
        this.oms.addListener('click', (marker => {
            this.broadcastEvent('set-active-record', document, {
                recordModel: marker.model,
                triggerPopup: true
            });
        }).bind(this));
        
        // hide popup if it's a spiderify click:
        this.oms.addListener('spiderfy', (() => {
            this.map.closePopup()
        }).bind(this));
        this.map.oms = this.oms;

        // var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
        // imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
        // L.imageOverlay(imageUrl, imageBounds).addTo(this.map);
    }

    getThumbnail (item) {
        for (const media of item.attached_photos_videos) {
            if (media.overlay_type === 'photo') {
                const photo = this.mapData.media.photos[media.id];
                return photo.path_small;
            }
        }
    }

    renderData () {
        document.querySelector('main').classList.remove('with-card');
        this.map.invalidateSize();

        // clear out old map markers if needed:
        // for (const key in this.markerLayers) {
        //     hideMarkerByLayerID(key);
        // }

        // for (const layerID in this.mapData.layers) {
        //     const layer = this.mapData.layers[layerID];
        //     this.markerLayers[layer.id] = {}
        //     const key = layer.dataset;
        //     // const dataset = this.mapData.datasets[key].data;
        //     const fields = this.mapData.datasets[key].fields;
        //     // const symbol = layer.symbols[0];
        //     for (const symbolID in layer.symbols) {
        //         const symbol = layer.symbols[symbolID];
        //         const mapMarkers = this.renderMarkers(layer, fields, symbol);
        //         this.markerLayers[layer.id][symbol.id] = mapMarkers;
        //     }
        // }

        for (const layerModel of this.model.layers) {
            for (const symbolModel of layerModel.symbols) {
                const symbolView = new SymbolMarkerView(this.map, symbolModel);
                this.childViews.push(symbolView);
            }
        }

        // add legend: 
        this.legend = new LegendView(this.map, this.model);
    };
  
}

class SymbolMarkerView {
    constructor (map, symbolModel) {
        this.map = map;
        this.model = symbolModel;
        this.model.registerObserver(this);
        this.childViews = [];

        for (const recordModel of this.model.records) {
            const markerView = new MarkerView(this.map, recordModel);
            this.childViews.push(markerView);
        }
    }

    update () {

    }
}

class MarkerView {
    constructor (map, recordModel) {
        this.map = map;
        this.oms = this.map.oms;
        this.model = recordModel;
        this.model.registerObserver(this);

        this.renderMarker();
    }

    renderMarker () {
        this.marker = L.marker(this.model.getLatLng(), {
            icon: this.model.getIcon()
        });
        this.marker.model = this.model;
        this.marker.bindPopup(this.getPopupHTML())
        if (this.model.symbolModel.isShowing) {
            this.marker.addTo(this.map);
        }
        this.oms.addMarker(this.marker);
    }

    update () {
        // console.log('Updating Record:', this.model.id);
        if (!this.marker) { return; }
        if (!this.model.isShowing()) {
            this.map.removeLayer(this.marker);
        } else {
            this.marker.addTo(this.map);
        }
    }

    getPopupHTML () {
        /*
        const thumbURL = getThumbnail(item);
        if (thumbURL) {
            return `
                <div class='popup-section'>
                    <img src="${thumbURL}" />
                    <p class="fade">
                        <strong>${item.name}</strong>
                        <br>
                        ${item.description}
                    </p>
                </div>`
            `;
        }*/
        return this.model.name;
        
    };
}