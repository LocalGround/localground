let numColumns = 4;
let markerLayers = [];
let map;
let oms;
let projectData;
let mapData;

const init = (projectJSON, mapJSON) => {
    projectData = projectJSON;
    mapData = mapJSON;
    //saveData(projectJSON, mapJSON);
    //console.log(projectJSON);
    console.log(mapJSON);
    drawMap();
    renderData();

};

// const popup = new L.Popup({
//     offset: [0, -30]
// });
const popup = new L.Popup();
const url = "../results/data.json";

const saveData = (data) => {
    // console.log(data);
    mapData = data;
};

const showCard = marker => {
    const item = marker.item;
    item.photos = [];
    if (item.attached_photos_videos) {
        for (const media of item.attached_photos_videos) {
            if (media.overlay_type === 'photo') {
                const photo = projectData.media.photos.data.find( item => {
                    return item.id === media.id;
                });
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

    // popup
    // popup.setContent(item.name);
    // popup.setLatLng(latLng);
    // map.openPopup(popup);
    marker.openPopup();
};

const drawMap = () => {	
    //Stamen Toner tiles attribution and URL
    var watercolorURL = 'http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}';
    var watercolorMap = L.tileLayer(watercolorURL,{
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20,
        ext: 'png'
    });
    map = L.map('mapid', {
        layers: [watercolorMap],
        trackResize: true,
        minZoom: 2,
        maxZoom: 14
    }).setView([36.972, -122.049], 5);

    // Add marker clustering control: 
    oms = new OverlappingMarkerSpiderfier(map);
    oms.addListener('click', showCard);
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
        const key = layer.dataset.overlay_type;
        const dataset = projectData.datasets[key].data;
        const fields = projectData.datasets[key].fields;
        const symbol = layer.symbols[0];
        const mapMarkers = [];
        markerLayers.push(mapMarkers);
        for (const item of dataset) {
            if (!item.geometry) {
                continue;
            }
            item.fields = fields;
            console.log(symbol)
            item.icon = L.icon({
                iconUrl: encodeURI("data:image/svg+xml," + symbol.svg).replace(/#/g,'%23'),
                iconSize: symbol.iconSize,
                iconAnchor: symbol.iconAnchor,
                popupAnchor: symbol.popupAnchor
            });
            const lng = item.geometry.coordinates[0];
            const lat = item.geometry.coordinates[1];
            const marker = L.marker([lat, lng], item).addTo(map);
            marker.bindPopup(item.name)
            marker.item = item;
            mapMarkers.push(marker);
            oms.addMarker(marker);
        }
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