class Card {
    item;
    cardHTML;
    selector;

    constructor (item) {
        this.item = item;

        // add mixins:
        Object.assign(this, mixins);
    }

    addCardToDOM (selector) {
        this.selector = selector;
        const item = this.item;
        const properties = this.getPropertiesTable(item);
        const photos = this.getPhotos(item);
        document.querySelector(selector).innerHTML = `<div class="card">
            <div class="desktop">
                <a class="less" href="#">x</a>
                <h2>${item.name}</h2>
                <p>${item.description.replace(/(?:\r\n|\r|\n)/g, '<br>')}</p>
                ${photos}
                ${properties}
            </div>
            <div class="mobile">
                <h2>${item.name}</h2>
                <a class="more" href="#"><i class="fas fa-expand"></i></a>
            </div>
        </div>`;

        // add event handlers to card:
        document.querySelector('.mobile .more').onclick = this.showFullscreen.bind(this);
        document.querySelector('.mobile h2').onclick = this.showFullscreen.bind(this);
        document.querySelector('.less').onclick = this.minimize.bind(this);
    }

    getPropertiesTable (model) {
        const rows = [];
        for (const field of model.dataset.fields) {
            if (['name', 'description'].find(model => {
                return model === field.key;
            })) { continue; }
            rows.push(`
                <tr>
                    <td>${field.col_alias}</td>
                    <td>${model[field.key]}</td>
                </tr>`
            );
        }  
        return `
            <table>
                ${rows.join('')}
            </table>
        `;
    }

    getPhotos (model) {
        const images = [];
        for (const item of model.attached_photos_videos) {
            if (item.overlay_type === 'photo') {
                images.push(`<div class="card"><img src="${item.path_large}" /></div>`) 
            }
        }
        //return `<section class="carousel">${images.join('')}</section>`;
        return `<section class="carousel">${images[0]}</section>`;
    }

    showFullscreen (ev) {
        document.querySelector('#card-holder').classList.add('fullscreen');
        this.broadcastEvent('refactor-map-bounds', ev.currentTarget, null);
    }

    minimize (ev) {
        document.querySelector('#card-holder').classList.remove('fullscreen');
        this.broadcastEvent('refactor-map-bounds', ev.currentTarget, null);
    }

}

