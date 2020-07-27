class Card {
    cardHTML;

    constructor (model) {
        this.model = model;

        // add mixins:
        Object.assign(this, mixins);
        this.el = this.createElementFromHTML(this.renderHTML());
    }

    renderHTML () {
        const title = this.model.display_value || 'Untitled';
        const properties = this.getPropertiesTable(this.model);
        const thumbnail = this.model.getThumbnail();
        let mobileHeader = `<h2><span>${title}</span></h2>`
        if (thumbnail) {
            mobileHeader = `<h2><img src="${thumbnail}" /><span>${title}</span></h2>`
        }
        let description = '';
        if (this.model.description) {
            description = `<p>${this.model.description.replace(/(?:\r\n|\r|\n)/g, '<br>')}</p>`;
        }
        return `<div class="card">
            <div class="desktop">
                <a class="less" href="#">x</a>
                <h2>${title}</h2>
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
    }

    initMedia () {
        //init carousel
        this.carousel = new Carousel(
            this.carousel = this.model.attached_photos_videos,
            this.el.querySelector('.carousel-container')
        );

        // init audio players
        if (this.model.attached_audio) {
            this.audioPlayers = [];
            for (const audioModel of this.model.attached_audio) {
                const player = new AudioPlayer(
                    audioModel,
                    this.el.querySelector('.audio-container')
                );
                this.audioPlayers.push(player);
            }
        }
    }

    initMobileMapView () {
        // add event handlers to card:
        this.el.querySelector('.mobile .more').onclick = this.showFullscreen.bind(this);
        this.el.querySelector('.mobile h2').onclick = this.showFullscreen.bind(this);
        this.el.querySelector('.less').onclick = this.minimize.bind(this);
    }

    addCardToDOM (selectorOrElement, replace=true, isMap=true) {
        if (typeof selectorOrElement === 'string') {
            this.parentEl = document.querySelector(selectorOrElement);
        } else {
            this.parentEl = selectorOrElement;
        }
        if (replace) {
            this.parentEl.innerHTML = '';  
        }
        this.parentEl.appendChild(this.el);
        this.initMedia();
        if (isMap) { this.initMobileMapView(); }
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
                    <td><strong>${model[field.key] || ''}</strong></td>
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

