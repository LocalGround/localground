class Map {
    map;
    oms;
    mapData;

    constructor (mapJSON) {
        Object.assign(this, mixins);

        this.applyMobileLayoutHack();
        this.mapData = mapJSON;
        this.model = new MapModel(mapJSON);
        this.drawMap();
        this.renderData();
        this.addEventListeners();

        this.showTitleCard();
    }

    applyMobileLayoutHack () {
        // From the Internet: Hack to ensure mobile fullscreen
        // https://chanind.github.io/javascript/2019/09/28/avoid-100vh-on-mobile-web.html
        function setDocHeight() {
            document.documentElement.style.setProperty('--vh', `${window.innerHeight/100}px`);
        };
        window.addEventListener('resize', setDocHeight);
        window.addEventListener('orientationchange', setDocHeight);
        setDocHeight();
    }

    addEventListeners () {
        this.attachListener("header h1", "click", this.showTitleCard.bind(this));
        document.addEventListener("set-active-record", this.setActiveRecord.bind(this));
        document.addEventListener("refactor-map-bounds", this.map.invalidateSize.bind(this));
    }

    showTitleCard () {
        if (!this.model.titleCard) {
            return;
        }
        const card = new Card(this.model.titleCard, '#card-holder');
        document.querySelector('main').classList.add('with-card');
        card.addCardToDOM();
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
                .setContent(this.selectedRecord.display_value)
                .openOn(this.map)
            }).bind(this), 10);
        }
    };

    drawMap () {	
    
        document.querySelector('header h1').innerHTML = this.model.name;
        //Stamen Toner tiles attribution and URL
        const tilesets = {
            'toner-lite': {
                'url': 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}',
                'subdomains': 'abcd'
            },
            'watercolor': {
                'url': 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}',
                'subdomains': 'abcd'
            },
            'roadmap': {
                'url': 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
                'subdomains': ['mt0','mt1','mt2','mt3']
            },
            'satellite': {
                'url': 'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
                'subdomains': ['mt0','mt1','mt2','mt3']
            },
            'terrain': {
                'url': 'https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
                'subdomains': ['mt0','mt1','mt2','mt3']
            },
            'hybrid': {
                'url': 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
                'subdomains': ['mt0','mt1','mt2','mt3']
            },
            'toner-background': {
                'url': 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.{ext}',
                'subdomains': 'abcd'
            },
            'esri-grayscale': {
                'url': 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
            } 
        }
        // set tileset; default to toner
        let tileset = tilesets[this.mapData.basemap];
        if (!tileset) {
            tileset = tilesets['toner-background'];
        }
        var basemapURL = tileset.url;
        var basemap;
        if (tileset.subdomains) {
            basemap = L.tileLayer(basemapURL, {
                subdomains: tileset.subdomains,
                minZoom: 0,
                maxZoom: 20,
                ext: 'png'
            });
        } else {
            var basemap = L.tileLayer(basemapURL, {
                minZoom: 0,
                maxZoom: 20,
                ext: 'png'
            });
        }
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
        //                 <strong>${this.model.display_value}</strong>
        //                 <br>
        //                 ${this.model.description}
        //             </p>
        //         </div>`;
        // }
        return this.model.display_value;
    };
}