class Carousel {
    constructor (photosVideos, selectorOrElement) {
        Object.assign(this, mixins);
        this.photosVideos = photosVideos;
        //this.parentEl = document.querySelector(selector);
        if (typeof selectorOrElement === 'string') {
            this.parentEl = document.querySelector(selectorOrElement);
        } else {
            this.parentEl = selectorOrElement;
        }
        this.numSlides = this.photosVideos.length;
        this.addToDOM();
    } 

    renderVideoCard (item) {
        let slide = '';
        if (item.video_provider === 'youtube') {
            slide = `<iframe src="https://www.youtube.com/embed/${item.video_id}?ecver=1" frameborder="0"></iframe>`;
        } else {
            slide = `<iframe src="https://player.vimeo.com/video/${item.video_id}" frameborder="0"></iframe>`;
        }
        if (item.caption) {
            slide += `<p class="caption">${item.caption}</p>`;
        }
        return slide;
    }

    renderPhotoCard (item) {
        let slide = `<img src="${item.path_large}" />`;
        if (item.caption) {
            slide += `<p class="caption">${item.caption}</p>`;
        }
        return slide;
    }

    addToDOM () {
        const media = [];
        const circles = [];
        for (const item of this.photosVideos) {
            if (item.overlay_type === 'photo') {
                media.push(this.renderPhotoCard(item));                
            } else {
                media.push(this.renderVideoCard(item));
            }
            circles.push(`<i class="far fa-circle"></i>`);
        }
        if (media.length === 0) {
            return;
        } else if (media.length === 1) {
            this.el = this.createElementFromHTML(
                `<section class="no-carousel">${media[0]}</section>`
            );
            this.parentEl.appendChild(this.el);
        } else {

            const slides = `
                <div class="slide active">
                    ${media.join('</div><div class="slide hide-left">')}
                </div>`;

            const circlesHTML = `<div class="thumbnails">${circles.join('')}</div>`;
            
            this.el = this.createElementFromHTML(`
                <div class="carousel noselect">
                    <section>
                        <i class="fa fa-chevron-left prev"></i>
                        <i class="fa fa-chevron-right next"></i>
                        ${slides}
                    </section>
                    ${circlesHTML}
                </div>
            `);
            this.initAnimationClasses();
            this.parentEl.appendChild(this.el);
            this.attachEventHandlers();
        }
    }

    initAnimationClasses () {
        if (!this.$el)
        this.activeSlide = this.el.querySelector('.slide.active');
        this.selectCircle(0);
        const nextSlide = this.getNextSlide();
        const previousSlide = this.getPreviousSlide();
        nextSlide.className = 'slide right';
        if (this.numSlides > 2) {
            previousSlide.className = 'slide left';
        }
    }

    selectCircle (idx) {
        const circles = this.getCircles();
        for (const circle of this.getCircles()) {
            circle.className = 'far fa-circle';
        }
        circles[idx].className =  'fas fa-circle';
    }

    getSlides () {
        return this.el.querySelectorAll('.slide');
    }

    getCircles () {
        return this.el.querySelectorAll('.fa-circle');
    }
    getIndex (element, elementList) {
        elementList = Array.from(elementList);
        return elementList.indexOf(element);
    }

    nextPrev (nextSlide, hideClass, swipedClass) {
        const activeSlide = this.activeSlide;
  
        // first reposition the slide w/o animation:
        nextSlide.className = 'slide ' + hideClass;
        setTimeout ((() => {
            // then advance the carousel. Not sure why the setTimeout is needed,
            // but <100 makes it jumpy.
            nextSlide.className = 'slide active';
            activeSlide.className = 'slide ' + swipedClass;
            this.activeSlide = nextSlide;
            const idx = this.getIndex(this.activeSlide, this.getSlides());
            this.selectCircle(idx);
        }).bind(this), 100);
    }

    next () {
        this.nextPrev(this.getNextSlide(), 'hide-right', 'left');
    }

    prev () {
        this.nextPrev(this.getPreviousSlide(), 'hide-left', 'right');
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

    jump (ev) {
        const circle = ev.currentTarget;
        const circles = this.getCircles()
        const slides = this.getSlides();

        for (const slide of this.getSlides()) {
            slide.className = 'slide hide-right';
        }

        const idx = this.getIndex(circle, circles);
        this.selectCircle(idx);
        this.activeSlide = slides[idx];
        this.activeSlide.className = 'slide current';
    }

    attachEventHandlers () {
        this.attachListener(this.el.querySelector('.next'), 'click', this.next.bind(this));
        this.attachListener(this.el.querySelector('.prev'), 'click', this.prev.bind(this));
        this.attachListener(this.el.querySelector('.slide'), 'click', this.next.bind(this));
        this.attachListener(this.el.querySelectorAll('.fa-circle'), 'click', this.jump.bind(this));
    }
}