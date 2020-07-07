class Map {
    map;
    oms;
    mapData;

    constructor (mapJSON) {
        Object.assign(this, mixins);

        this.mapData = mapJSON;
        this.model = new MapModel(mapJSON);
        this.drawMap();
        this.renderData();
        this.addEventListeners();
    }

    addEventListeners () {
        document.addEventListener("set-active-record", this.setActiveRecord.bind(this));
        document.addEventListener("refactor-map-bounds", this.map.invalidateSize.bind(this));
    }

    setActiveRecord (ev) {
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
        const card = new Card(this.selectedRecord, '#card-holder');
        document.querySelector('main').classList.add('with-card');
        card.addCardToDOM()

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
            },
            'esri-grayscale': {
                'url': 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
            } 
        }
        // set tileset; default to toner
        let tileset = tilesets[this.mapData.basemap];
        // let tileset = tilesets['esri-grayscale'];
        if (!tileset) {
            tileset = tilesets['toner-lite'];
        }
        var basemapURL = tileset.url
        var basemap = L.tileLayer(basemapURL, {
            // subdomains: tileset.subdomains,
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
                triggerPopup: false
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

    renderData () {
        document.querySelector('main').classList.remove('with-card');
        this.map.invalidateSize();

        for (const layerModel of this.model.layers) {
            for (const symbolModel of layerModel.symbols) {
                new SymbolMarkerView(this.map, symbolModel);
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

        for (const recordModel of this.model.records) {
            new MarkerView(this.map, recordModel);
        }
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
        // const thumbURL = this.model.getThumbnail();
        // if (thumbURL) {
        //     return `
        //         <div class='popup-section'>
        //             <img src="${thumbURL}" />
        //             <p class="fade">
        //                 <strong>${this.model.name}</strong>
        //                 <br>
        //                 ${this.model.description}
        //             </p>
        //         </div>`;
        // }
        return this.model.name;
    };
}