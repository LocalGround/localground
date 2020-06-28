
const getPropertiesTable = (item) => {
    const rows = [];
    for (const field of item.fields) {
        rows.push(`
            <tr>
                <td>${field.col_alias}</td>
                <td>${item[field.key]}</td>
            </tr>`
        );
    }  
    return `
        <table>
            ${rows.join('')}
        </table>
    `;
};

const getPhotos = (item) => {
    for (const photo of item.photos) {
        return `<img src="${photo.path_large}" />`
    }
};
const generateCard = (item) => {
    const properties = getPropertiesTable(item);
    const photos = getPhotos(item);
     
    return `<div class="card">
        <div class="desktop">
            <a class="less" href="#">x</a>
            <h2>${item.name}</h2>
            <p>${item.description}</p>
            ${photos}
            ${properties}
        </div>
        <div class="mobile">
            <h2>${item.name}</h2>
            <a class="more" href="#"><i class="fas fa-expand"></i></a>
        </div>
   </div>`;






    let paragraphs = '';
    if (map.paragraphs.length > 1) {
        for (para of map.paragraphs.slice(1)) {
            paragraphs += `<p>${para}</p>`;
        }
    }
    let placeInfo = '';
    let geom = '';
    if (map.location) {
        let locale = '';
        if (map.location.city) {
            locale += map.location.city + ', ';
        }
        if (map.location.state) {
            locale += map.location.state + ', ';
        }
        if (map.location.country) {
            locale += map.location.country;
        }
        if (map.location.geometry && map.location.geometry.lng && map.location.geometry.lat) {
            let lat = parseFloat(map.location.geometry.lat);
            let lng = parseFloat( map.location.geometry.lng)
            geom = '(' + lat.toFixed(3) + ', ' + lng.toFixed(3) + ')';
        }
        placeInfo = `
            <table>
                <tr>
                    <th>Original:</th>
                    <td>${map.place}</td>
                </tr>
                <tr>
                    <th>Geocoded:</th>
                    <td>${locale}</td>
                </tr>
                <tr>
                    <th>Coordinates</th>
                    <td>
                        <i class="fas fa-map-marker-alt"></i> 
                        ${geom}
                    </td>
                </tr>
            </table>
        `;
    }
    return `<div class="card">
        <div class="desktop">
            <a class="less" href="#">x</a>
            <h2>${map.header}</h2>
            <p>${map.paragraphs[0]}</p>
            <img src="${map.image_source}" />
            ${paragraphs}
            <p><strong>${map.footer}</strong></p>
            ${placeInfo}
            <span class="tag">${map.tags.join('</span><span class="tag">')}</span>
        </div>
        <div class="mobile">
            <h2>${map.header}</h2>
            <a class="more" href="#"><i class="fas fa-expand"></i></a>
        </div>
   </div>`;
};

