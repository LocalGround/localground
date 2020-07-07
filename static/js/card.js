class Card {
    cardHTML;
    selector;

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
        let mobileHeader = `<h2>${model.name}</h2>`
        if (thumbnail) {
            mobileHeader = `<h2><img src="${thumbnail}" />${model.name}</h2>`
        }
        this.el.innerHTML = `<div class="card">
            <div class="desktop">
                <a class="less" href="#">x</a>
                <h2>${model.name}</h2>
                <section class="carousel-container"></section>
                <p>${model.description.replace(/(?:\r\n|\r|\n)/g, '<br>')}</p>
                ${properties}
            </div>
            <section class="mobile card-header-minimized">
                ${mobileHeader}
                <a class="more" href="#"><i class="fas fa-expand"></i></a>
            </section>
        </div>`;
        const carousel = new Carousel(
            model.attached_photos_videos, 
            this.el.querySelector('.carousel-container'));
        carousel.addToDOM();

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

    showFullscreen (ev) {
        document.querySelector('#card-holder').classList.add('fullscreen');
        this.broadcastEvent('refactor-map-bounds', ev.currentTarget, null);
    }

    minimize (ev) {
        document.querySelector('#card-holder').classList.remove('fullscreen');
        this.broadcastEvent('refactor-map-bounds', ev.currentTarget, null);
    }

}

class Carousel {
    constructor (photosVideos, parentElement) {
        Object.assign(this, mixins);
        this.photosVideos = photosVideos;
        this.parentEl = parentElement;
        this.numSlides = this.photosVideos.length;
    } 

    addToDOM () {
        const images = [];
        for (const item of this.photosVideos) {
            if (item.overlay_type === 'photo') {
                images.push(`<img src="${item.path_large}" />`) 
            }
        }
        if (images.length === 1) {
            this.el = this.createElementFromHTML(
                `<section class="no-carousel">${images[0]}</section>`
            );
            this.parentEl.appendChild(this.el);
        } else {
            const slides = `
                <div class="slide active">
                    ${images.join('</div><div class="slide hide-left">')}
                </div>`;
            this.el = this.createElementFromHTML(`
                <section class="carousel noselect">
                    <i class="fa fa-chevron-left prev"></i>
                    <i class="fa fa-chevron-right next"></i>
                    ${slides}
                </section>`);
            this.initAnimationClasses();
            this.parentEl.appendChild(this.el);
            this.attachEventHandlers();
        }
    }

    initAnimationClasses () {
        if (!this.$el)
        this.activeSlide = this.el.querySelector('.slide.active');
        const nextSlide = this.getNextSlide();
        const previousSlide = this.getPreviousSlide();
        nextSlide.className = 'slide right';
        if (this.numSlides > 2) {
            previousSlide.className = 'slide left';
        }
    }

    next () {
        const activeSlide = this.activeSlide;
        const nextSlide = this.getNextSlide();
  
        // first reposition the slide w/o animation:
        nextSlide.className = 'slide hide-right';
        setTimeout ((() => {
            // then advance the carousel. Not sure why the setTimeout is needed,
            // but <100 makes it jumpy.
            nextSlide.className = 'slide active';
            activeSlide.className = 'slide left';
            this.activeSlide = nextSlide;
        }).bind(this), 100);
        
    }

    prev () {
        const activeSlide = this.activeSlide;
        const nextSlide = this.getPreviousSlide();
  
        // first reposition the slide w/o animation:
        nextSlide.className = 'slide hide-left';
        setTimeout ((() => {
            nextSlide.className = 'slide active';
            activeSlide.className = 'slide right';
            this.activeSlide = nextSlide;
        }).bind(this), 100);
    }

    getPreviousSlide () {
        let slide = this.activeSlide.previousElementSibling;
        if (slide.classList.contains('fa')) {
            const slides = this.el.querySelectorAll('.slide');
            slide = slides[slides.length - 1];
        }
        return slide;
    }


    getNextSlide () {
        return this.activeSlide.nextElementSibling || 
            this.el.querySelector('.slide');
    }

    attachEventHandlers () {
        this.attachListener('.next', 'click', this.next.bind(this));
        this.attachListener('.prev', 'click', this.prev.bind(this));
        this.attachListener('.slide', 'click', this.next.bind(this));
    }

}

