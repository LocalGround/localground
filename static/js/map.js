class Map {

    markerLayers = {};
    map;
    oms;
    mapData;

    constructor (mapJSON) {
        this.mapData = mapJSON;
        this.model = new MapModel(mapJSON);
        this.model.observers.push(this);
        this.drawMap();
        this.renderData();
        this.addEventListeners();
    }

    addEventListeners () {
        document.addEventListener("toggle-layer-visibility", this.toggleLayerVisibility.bind(this));
        document.addEventListener("toggle-symbol-visibility", this.toggleSymbolVisibility.bind(this));
        document.addEventListener("show-item", this.showCardByEvent.bind(this));
        document.addEventListener("refactor-map-bounds", this.map.invalidateSize.bind(this));
    }
    update (model) {
        document.querySelector('header h1').innerHTML = model.name;
    }

    toggleLayerVisibility (ev) {
        if (ev.detail.show) {
            this.showMarkerByLayerID(ev.detail.layerID);
        } else {
            this.hideMarkerByLayerID(ev.detail.layerID);
        }
    }

    toggleSymbolVisibility (ev) {
        const symbol = this.markerLayers[ev.detail.layerID][ev.detail.symbolID];
        if (ev.detail.show) {
            this.showMarkerBySymbol(symbol);
        } else {
            this.hideMarkerBySymbol(symbol);
        }
    }


    hideMarkerByLayerID (id) {
        for (const key in this.markerLayers[id]) {
            this.hideMarkerBySymbol(this.markerLayers[id][key]);
        }
    }
    
    hideMarkerBySymbol (symbolLayer) {
        for (const mapMarker of Object.values(symbolLayer)) {
            this.map.removeLayer(mapMarker);
        }
    }
    showMarkerByLayerID (id) {
        for (const key in this.markerLayers[id]) {
            this.showMarkerBySymbol(this.markerLayers[id][key]);
        }
    }

    showMarkerBySymbol (symbolLayer) {
        for (const mapMarker of Object.values(symbolLayer)) {
            mapMarker.addTo(this.map);
        }
    }

    showCardByEvent (ev) {
        const layer = this.markerLayers[ev.detail.layerID];
        const symbol = layer[ev.detail.symbolID];
        const marker = symbol[ev.detail.recordID];
        this.showCard(marker);

        // this is a hack. Not sure why timeout is necessary:
        setTimeout((() => {
            L.popup()
            .setLatLng(marker.getLatLng())
            .setContent(marker.item.name)
            .openOn(this.map)
        }).bind(this), 10);

        ev.stopPropagation();
    }

    showCard (marker) {
        const item = marker.item;
        item.photos = [];
        if (item.attached_photos_videos) {
            for (const media of item.attached_photos_videos) {
                if (media.overlay_type === 'photo') {
                    const photo = this.mapData.media.photos[media.id];
                    item.photos.push(photo);
                }
            }
        }
        const latLng = marker.getLatLng();
        setTimeout((() => { 
            this.map.invalidateSize()
            this.map.setView(latLng); 
        }).bind(this), 10);

        // Card right-hand side:
        const card = new Card(item);
        document.querySelector('main').classList.add('with-card');
        card.addCardToDOM('#card-holder')
        // document.querySelector('#card-holder').innerHTML = card.cardHTML
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
        this.oms.addListener('click', this.showCard.bind(this));
        
        // hide popup if it's a spiderify click:
        this.oms.addListener('spiderfy', (() => {
            this.map.closePopup()
        }).bind(this));

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
        for (const key in this.markerLayers) {
            hideMarkerByLayerID(key);
        }

        for (const layerID in this.mapData.layers) {
            const layer = this.mapData.layers[layerID];
            this.markerLayers[layer.id] = {}
            const key = layer.dataset;
            // const dataset = this.mapData.datasets[key].data;
            const fields = this.mapData.datasets[key].fields;
            // const symbol = layer.symbols[0];
            for (const symbolID in layer.symbols) {
                const symbol = layer.symbols[symbolID];
                const mapMarkers = this.renderMarkers(layer, fields, symbol);
                this.markerLayers[layer.id][symbol.id] = mapMarkers;
            }
        }

        // add legend: 
        const legend = new Legend(this.map, this.mapData.layers);
    };

    renderMarkers (layer, fields, symbol) {
        const mapMarkers = {};
        // this.markerLayers[layer.id] = mapMarkers;
        for (const recordID in symbol.records) {
            const item = symbol.records[recordID];

            if (!item.geometry) {
                continue;
            }
            item.fields = fields;
            
            item.icon = L.icon({
                iconUrl: encodeURI("data:image/svg+xml," + symbol.svg).replace(/#/g,'%23'),
                iconSize: symbol.iconSize,
                iconAnchor: symbol.iconAnchor,
                popupAnchor: symbol.popupAnchor
            });
            const lng = item.geometry.coordinates[0];
            const lat = item.geometry.coordinates[1];
            const marker = L.marker([lat, lng], item);
            if (symbol.isShowing) {
                marker.addTo(this.map);
            }
            this.attachPopup(marker, item);
            marker.item = item;
            mapMarkers[item.id] = marker;
            this.oms.addMarker(marker);
        }
        return mapMarkers;
    }

    attachPopup (marker, item) {
        marker.bindPopup(item.name)
        /*const thumbURL = getThumbnail(item);
        if (thumbURL) {
            marker.bindPopup(`
                <div class='popup-section'>
                    <img src="${thumbURL}" />
                    <p class="fade">
                        <strong>${item.name}</strong>
                        <br>
                        ${item.description}
                    </p>
                </div>`
            );
        } else {
            marker.bindPopup(item.name)
        }*/
    };
}