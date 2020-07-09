class Card {
    cardHTML;

    constructor (model, selector) {
        this.model = model;

        // add mixins:
        Object.assign(this, mixins);
        this.el = document.querySelector(selector);
    }

    addCardToDOM () {
        const model = this.model;
        const properties = this.getPropertiesTable(model);
        const thumbnail = model.getThumbnail();
        let mobileHeader = `<h2><span>${model.display_value}</span></h2>`
        if (thumbnail) {
            mobileHeader = `<h2><img src="${thumbnail}" /><span>${model.display_value}</span></h2>`
        }
        let description = '';
        if (model.description) {
            description = `<p>${model.description.replace(/(?:\r\n|\r|\n)/g, '<br>')}</p>`;
        }
        this.el.innerHTML = `<div class="card">
            <div class="desktop">
                <a class="less" href="#">x</a>
                <h2>${model.display_value}</h2>
                <section class="carousel-container"></section>
                <section class="audio-container"></section>
                ${description}
                ${properties}
            </div>
            <section class="mobile card-header-minimized">
                ${mobileHeader}
                <a class="more" href="#"><i class="fas fa-expand"></i></a>
            </section>
        </div>`;

        //init carousel
        this.carousel = new Carousel(
            this.carousel = model.attached_photos_videos,
            '.carousel-container'
        );

        // init audio players
        if (model.attached_audio) {
            this.audioPlayers = [];
            for (const audioModel of model.attached_audio) {
                const player = new AudioPlayer(
                    audioModel,
                    '.audio-container'
                );
                this.audioPlayers.push(player);
            }
        }

        // add event handlers to card:
        document.querySelector('.mobile .more').onclick = this.showFullscreen.bind(this);
        document.querySelector('.mobile h2').onclick = this.showFullscreen.bind(this);
        document.querySelector('.less').onclick = this.minimize.bind(this);
    }

    getPropertiesTable (model) {
        if (!model.dataset || !model.dataset.fields) {
            return '';
        }
        const rows = [];
        for (const field of model.dataset.fields) {
            if (['name', 'description'].find(model => {
                return model === field.key;
            })) { continue; }
            rows.push(`
                <tr>
                    <td>${field.col_alias}</td>
                    <td><strong>${model[field.key]}</strong></td>
                </tr>`
            );
        }  
        return `
            <table class="properties paragraph-style">
                ${rows.join('')}
            </table>
        `;
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

