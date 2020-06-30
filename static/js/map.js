let numColumns = 4;
let markerLayers = [];
let map;
let oms;
let mapData;

const init = (mapJSON) => {
    mapData = mapJSON;
    console.log(mapData);
    // console.log(mapData);
    drawMap();
    renderData();
};

const showCard = marker => {
    const item = marker.item;
    item.photos = [];
    if (item.attached_photos_videos) {
        for (const media of item.attached_photos_videos) {
            if (media.overlay_type === 'photo') {
                const photo = mapData.media.photos[media.id];
                item.photos.push(photo);
            }
        }
    }
    const latLng = marker.getLatLng();
    setTimeout(() => { 
        map.invalidateSize()
        map.setView(latLng); 
    }, 10);

    // Card right-hand side:
    document.querySelector('main').classList.add('with-card');
    document.querySelector('#card-holder').innerHTML = generateCard(item);
    document.querySelector('.mobile .more').onclick = showFullscreen;
    document.querySelector('.mobile h2').onclick = showFullscreen;
    document.querySelector('.less').onclick = minimize;
};

const drawMap = () => {	
    console.log(mapData);
    
    document.querySelector('header h1').innerHTML = mapData.name;
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
    let tileset = tilesets[mapData.basemap];
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
    const center = mapData.center.coordinates;
    map = L.map('mapid', {
        layers: [basemap],
        trackResize: true
    }).setView([center[1], center[0]], mapData.zoom);

    // Add marker clustering control: 
    oms = new OverlappingMarkerSpiderfier(map);
    oms.addListener('click', showCard);
    
    // hide popup if it's a spiderify click:
    oms.addListener('spiderfy', function(markers) {
        map.closePopup();
    });

    // var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
    // imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
    // L.imageOverlay(imageUrl, imageBounds).addTo(map);
};

const getThumbnail = item => {
    for (const media of item.attached_photos_videos) {
        if (media.overlay_type === 'photo') {
            const photo = mapData.media.photos[media.id];
            return photo.path_small;
        }
    }
    
};

const renderData = () => {
    document.querySelector('main').classList.remove('with-card');
    map.invalidateSize();

    // clear out old map markers if needed:
    if (markerLayers.length > 0) {
        for (const layer of markerLayers) {
            for (const mapMarker of layer) {
                map.removeLayer(mapMarker);
            }
        }
        markerLayers = [];
    }

    for (const layer of mapData.layers) {
        const key = layer.dataset;
        const dataset = mapData.datasets[key].data;
        const fields = mapData.datasets[key].fields;
        // const symbol = layer.symbols[0];
        for (const symbol of layer.symbols) {
            const mapMarkers = renderMarkers(dataset, fields, symbol);
            //markerLayers.push(mapMarkers);
        }
    }
};

const renderMarkers = (dataset, fields, symbol) => {
    const mapMarkers = [];
    markerLayers.push(mapMarkers);
    // console.log(symbol.rec_ids);
    for (const item of symbol.records) {
        // const item = dataset[id];
        // console.log(item);
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
        const marker = L.marker([lat, lng], item).addTo(map);
        attachPopup(marker, item);
        marker.item = item;
        mapMarkers.push(marker);
        oms.addMarker(marker);
    }
    return mapMarkers;
};

const attachPopup = (marker, item) => {
    const thumbURL = getThumbnail(item);
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
    }
};

const showFullscreen = () => {
    document.querySelector('#card-holder').classList.add('fullscreen');
    map.invalidateSize();
};
const minimize = () => {
    document.querySelector('#card-holder').classList.remove('fullscreen');
    map.invalidateSize();
};