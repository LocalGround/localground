class AudioPlayer {

    constructor (model, selector) {
        // add mixins:
        Object.assign(this, mixins);

        this.model = model;
        this.parentEl = document.querySelector(selector);

        this.addToDOM(); 
    }

    addToDOM () {
        let caption = '';
        if (this.model.caption) {
            caption = `<p class="caption">${this.model.caption}</p>`;
        }
        this.el = this.createElementFromHTML(`
            <div class="audio-player">
                <audio class="audio">
                    <source src="${this.model.file_path}" type="audio/mp3">
                </audio>
                <div class="player-controls">
                    <i class="fa fa-play playAudio"></i>
                    <div class="seekObjContainer">
                        <div class="seekObj">
                            <div class="percentage"></div>
                        </div>
                    </div>
                    <p><small class="currentTime">00:00</small></p>
                </div>
                ${caption}
            </div>`);
        this.parentEl.appendChild(this.el);
        this.media = this.el.querySelector('.audio');
        this.addEventHandlers();
    }

    togglePlay () {
        if (this.media.paused === false) {
            this.media.pause();
            this.el.querySelector('.playAudio').classList.remove('fa-pause');
            this.el.querySelector('.playAudio').classList.add('fa-play');
        } else {
            this.media.play();
            this.el.querySelector('.playAudio').classList.add('fa-pause');
            this.el.querySelector('.playAudio').classList.remove('fa-play');
        }
    }

    calculatePercentPlayed() {
        let percentage = (this.media.currentTime / this.media.duration).toFixed(2) * 100;
        this.el.querySelector('.percentage').style.width = `${percentage}%`;
    }

    calculateCurrentValue(currentTime) {
        const currentMinute = parseInt(currentTime / 60) % 60;
        const currentSecondsLong = currentTime % 60;
        const currentSeconds = currentSecondsLong.toFixed();
        const currentTimeFormatted = `${currentMinute < 10 ? `0${currentMinute}` : currentMinute}:${
            currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds
        }`;
    
        return currentTimeFormatted;
    }

    seek (e) {
        const elem = e.currentTarget;
        const percent = e.offsetX / elem.offsetWidth;
        this.media.currentTime = percent * this.media.duration;
    }

    initProgressBar() { 
        const currentTime = this.calculateCurrentValue(this.media.currentTime);
        this.el.querySelector('.currentTime').innerHTML = currentTime;
        
        this.media.onended = () => {
            this.el.querySelector('.playAudio').classList.remove('fa-pause');
            this.el.querySelector('.playAudio').classList.add('fa-play');
            this.el.querySelector('.percentage').style.width = 0;
            this.el.querySelector('.currentTime').innerHTML = '00:00';
        };
    
        this.calculatePercentPlayed();
    }

    addEventHandlers () {
        this.el.querySelector('.seekObj').addEventListener('click', this.seek.bind(this));
        this.el.querySelector('.playAudio').addEventListener('click', this.togglePlay.bind(this));
        this.el.querySelector('.audio').addEventListener('timeupdate', this.initProgressBar.bind(this));
    } 
}