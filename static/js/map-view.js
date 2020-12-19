class MapView {
    map;
    oms;

    constructor (model) {
        Object.assign(this, mixins);
        this.model = model;
        console.log(this.model.getRecords());

        this.applyMobileLayoutHack();
        this.drawMap();
        this.renderData();
        this.addEventListeners();

        this.showTitleCard();
    }

    setDocHeight () {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight/100}px`);
    }

    applyMobileLayoutHack () {
        // From the Internet: Hack to ensure mobile fullscreen
        // https://chanind.github.io/javascript/2019/09/28/avoid-100vh-on-mobile-web.html
        window.addEventListener('resize', this.setDocHeight);
        window.addEventListener('orientationchange', this.setDocHeight);
        this.setDocHeight();
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
        document.querySelector('main').classList.add('with-card');
        const card = new Card(this.model.titleCard);
        card.addCardToDOM('#card-holder');
    }

    setActiveRecord (ev) {
        if (this.selectedRecord) {
            this.selectedRecord.setIsActive(false);
        }
        console.log(ev, 'setActiveRecord');
        this.selectedShape = ev.detail.shape;
        this.selectedRecord = ev.detail.recordModel;
        this.selectedRecord.setIsActive(true);
        const latLng = this.selectedShape.getLatLng();
        setTimeout((() => { 
            this.map.invalidateSize()
            this.map.setView(latLng); 
        }).bind(this), 10);

        // Card right-hand side:
        this.selectedRecord.photos = [];
        document.querySelector('main').classList.add('with-card');
        const card = new Card(this.selectedRecord);
        card.addCardToDOM('#card-holder');

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
        document.querySelector('body').style.overflowY = 'hidden'; 
        document.querySelector('main').innerHTML = `
            <section id="card-holder"></section>
            <div id="mapid"></div>`;
        document.querySelector('main').className = 'map'; 
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
            'hybrid': {
                'url': 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
                'subdomains': ['mt0','mt1','mt2','mt3']
            },
            'toner': {
                'url': 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}',
                'subdomains': 'abcd'
            },
            'blueprint': {
                'url': 'https://api.mapbox.com/styles/v1/lg/ckchr87ca2ct31iqt1f93334t/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibGciLCJhIjoibWd5aTl2VSJ9.W9ZsT1zQsI9ZP72KtTdZTA'
            },
            'esri-grayscale': {
                'url': 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
            } 
        }
        // set tileset; default to toner
        // let tileset = tilesets['blueprint'];
        let tileset = tilesets[this.model.basemap];
        if (!tileset) {
            tileset = tilesets['toner-lite'];
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
        const center = this.model.center.coordinates;
        this.map = L.map('mapid', {
            layers: [basemap],
            trackResize: true
        }).setView([center[1], center[0]], this.model.zoom);

        // Add marker clustering control: 
        this.oms = new OverlappingMarkerSpiderfier(this.map);
        this.oms.addListener('click', (shape => {
            const data = {
                shape: shape,
                recordModel: shape.model,
                triggerPopup: false
            };
            console.log(data)
            this.broadcastEvent('set-active-record', document, data);
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
    }

    destroy () {
        // make sure you remove event handlers or there will be chaos:
        window.removeEventListener('resize', this.setDocHeight);
        window.removeEventListener('orientationchange', this.setDocHeight);
    }
  
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

        this.renderShape();
    }

    renderPoint () {
        this.shape = L.marker(this.model.getCoordinates(), {
            icon: this.model.getIcon()
        });
    }

    renderPolyline () {
        console.log('Model:', this.model);
        this.shape = L.polyline(this.model.getCoordinates(), {
            color: this.model.symbolModel.fillColor
        });
        // this is a hack so that the spiderify library works clustering works
        // which requires that the getLatLng method exists:
        this.shape.getLatLng = this.shape.getCenter;
    }

    renderPolygon () {
        console.log('render polygon:', this.model.getCoordinates());
        this.shape = L.polygon(this.model.getCoordinates(), {
            color: this.model.symbolModel.fillColor
        });
        // this is a hack so that the spiderify library works clustering works
        // which requires that the getLatLng method exists:
        this.shape.getLatLng = this.shape.getCenter;
    }

    renderShape () {
        if (this.model.isPoint()) {
            this.renderPoint();
        } else if (this.model.isPolyline()) {
            this.renderPolyline();
        } else if (this.model.isPolygon()) {
            this.renderPolygon();
        } else {
            console.error('Shape not recognized:', this.model.geometry);
        }

        // once symbol has been set, add to map; add event handlers:
        if (this.shape) {
            this.shape.model = this.model;
            this.shape.bindPopup(this.getPopupHTML())
            if (this.model.symbolModel.isShowing) {
                this.shape.addTo(this.map);
            }
            this.oms.addMarker(this.shape);
        }
    }

    update () {
        // console.log('Updating Record:', this.model.id);
        if (!this.shape) { return; }
        if (!this.model.isShowing()) {
            this.map.removeLayer(this.shape);
        } else {
            this.shape.addTo(this.map);
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