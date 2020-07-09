// class AudioPlayer {

//     constructor (model, selector) {
//         // add mixins:
//         Object.assign(this, mixins);

//         this.model = model;
//         this.parentEl = document.querySelector(selector);

//         this.suspendUIUpdate = false;
//         this.audio = null;
//         this.addToDOM();
        
//     }
        
//     addToDOM () {
//         this.el = this.createElementFromHTML(`
//             <div class="audio-detail">
//                 <audio preload class="audio">
//                     <source src="${this.model.file_path}" type="audio/mpeg" />
//                 </audio>
//                 <div class="audio-container">
//                     <div class="audio-progress">
//                         <div class="play-ctrls">
//                             <i class="fa fa-play fa-lg play" aria-hidden="true"></i>
//                         </div>
//                         <div class="progress-container">
//                             <div class="audio-progress-bar></div>
//                             <div class="audio-progress-duration"></div>
//                             <div class="audio-progress-circle"></div>
//                         </div>
//                     </div>
//                     <div class="info-container">
//                         <span class="audio-labels time-current"></span>
//                         <p class="audio-info">${this.model.name}</p>

//                         <p class="audio-caption">
//                             ${this.model.caption}
//                         </p>
//                     </div>
//                 </div>
//             </div>`);
//         this.parentEl.appendChild(this.el);
//         this.audio = this.el.querySelector('.audio');
//         this.addEventHandlers();
//     }
    
//     initialize (opts) {
//         opts = opts || {};
//         _.extend(this, opts);
//         //this.detachMedia = this.detachMedia || (() => {});
//         this.render();
//         this.audio = this.el.querySelector(".audio").get(0);
//         this.secondaryModal = this.app.secondaryModal;
//         this.listenTo(this.app.vent, 'audio-carousel-advanced', this.stop);

//         // need to attach audio events directly to the element b/c the
//         // HTML5 audio events work slightly differently than other element
//         // events:
//         _.bindAll(this, 'playerDurationUpdate');
//         this.el.querySelector('audio').on('timeupdate', this.playerDurationUpdate);
//         this.el.querySelector('audio').on('ended', this.showPlayButton.bind(this));
//     }

//     // onRender () {
//     //     if (!this.el.querySelector('.progress-container').get(0)) {
//     //         return;
//     //     }
//     //     // setTimeout necessary b/c need to wait 'til rendered audio player
//     //     // has been attached to the DOM in order to calculate the offset
//     //     setTimeout(this.initDraggable.bind(this), 50);
//     // }

//     initDraggable () {
//         var $c = this.el.querySelector('.progress-container'),
//             x = $c.offset().left,
//             w = $c.width(),
//             containment = [x, 0, x + w + 5, 0],
//             that = this;
//         this.el.querySelector(".audio-progress-circle").draggable({
//             axis: "x",
//             containment: containment, //[ x1, y1, x2, y2 ]
//             start: that.seek.bind(that),
//             stop: that.jumpToTime.bind(that)
//         });
//     }

//     stop () {
//         this.showPlayButton();
//         this.audio.pause();
//     }

//     showPauseButton () {
//         console.log('pause');
//         this.el.querySelector(".play").classList.remove('fa-play');
//         this.el.querySelector(".play").classList.add('fa-pause');    
//     }

//     showPlayButton () {
//         this.el.querySelector(".play").classList.add('fa-play');
//         this.el.querySelector(".play").classList.remove('fa-pause');
//     }

//     togglePlay () {
//         if (this.audio.paused) {
//             this.audio.play();
//         } else {
//             this.audio.pause();
//             this.showPlayButton();
//         }
//     }

//     volumeUp () {
//         this.audio.volume += ((this.audio.volume + 0.1) < 1) ? 0.1 : 0;
//     }

//     volumeDown () {
//         this.audio.volume -= ((this.audio.volume - 0.1) > 0) ? 0.1 : 0;
//     }

//     jumpToTime (e) {
//         this.suspendUIUpdate = false;
//         const progressContainer = this.el.querySelector('.progress-container');
//         const posX = progressContainer.offsetLeft;
//         const w = (e.pageX - posX) / progressContainer.clientWidth;
//         const duration = !isNaN(this.audio.duration) ? this.audio.duration : 5000; //spoof duration for test
//         this.audio.currentTime = w * duration;
//         if (this.audio.paused) {
//             this.showPauseButton();
//             this.audio.play();
//         }
//     }

//     seek () {
//         this.suspendUIUpdate = true;
//     }

//     skipForward () {
//         if (this.audio.currentTime < this.audio.duration) {
//             var skipStep = this.audio.duration / 10;
//             this.audio.currentTime += skipStep;
//         } else {
//             this.audio.currentTime = this.audio.duration;
//         }
//     }

//     skipBackward () {
//         if (this.audio.currentTime > 0) {
//             var skipStep = this.audio.duration / 10;
//             this.audio.currentTime -= skipStep;
//         } else {
//             this.audio.currentTime = 0;
//         }
//     }

//     playerDurationUpdate (e, pos) {
//         if (this.suspendUIUpdate) {
//             return;
//         }
//         if (!pos) {
//             pos = this.audio.currentTime / this.audio.duration * 100 + "%";
//         }
//         this.el.querySelector(".audio-progress-duration").width(pos);
//         this.el.querySelector(".audio-progress-circle").css({
//             "left": "calc(" + pos + ")"
//         });
//         this.el.querySelector(".time-current").html(this.getCurrentTime());
//         this.el.querySelector(".time-duration").html(this.getDuration());
//         e.preventDefault();
//     }

//     formatTime (timeCount) {
//         var seconds = timeCount,
//             minutes = Math.floor(seconds / 60);
//         minutes = (minutes >= 10) ? minutes : "0" + minutes;
//         seconds = Math.floor(seconds % 60);
//         seconds = (seconds >= 10) ? seconds : "0" + seconds;
//         return minutes + ":" + seconds;
//     }

//     getDuration () {
//         return this.formatTime(this.audio.duration);
//     }

//     getCurrentTime () {
//         return this.formatTime(this.audio.currentTime);
//     }

//     addEventHandlers () {
//         this.attachListener('.play', 'click', this.togglePlay.bind(this));
//         this.attachListener('.skip-fwd', 'click', this.skipForward.bind(this));
//         this.attachListener('.skip-back', 'click', this.skipBackward.bind(this));
//         this.attachListener('.progress-container', 'click', this.jumpToTime.bind(this));
//     }
// }


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
                    <button class="playAudio"></button>
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
        // this.initProgressBar();
        this.addEventHandlers();
    }
    

    togglePlay () {
        if (this.media.paused === false) {
            this.media.pause();
            this.el.querySelector('.playAudio').classList.remove('pause');
        } else {
            this.media.play();
            this.el.querySelector('.playAudio').classList.add('pause');
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
        console.log(this);
        console.log(e.offsetX, elem.offsetWidth);
        const percent = e.offsetX / elem.offsetWidth;
        console.log(percent);
        console.log(this.media.duration);
        this.media.currentTime = percent * this.media.duration;
    }
    

    initProgressBar() {
        
        const currentTime = this.calculateCurrentValue(this.media.currentTime);
        this.el.querySelector('.currentTime').innerHTML = currentTime;

        
        this.media.onended = () => {
            this.el.querySelector('.playAudio').classList.remove('pause');
            this.el.querySelector('.percentage').style.width = 0;
            this.el.querySelector('.currentTime').innerHTML = '00:00';
        };
    
        this.calculatePercentPlayed();
    }

    addEventHandlers () {
        this.el.querySelector('.seekObj').addEventListener('click', this.seek.bind(this));
        // this.attachListener('.play', 'click', this.togglePlay.bind(this));
        this.el.querySelector('.playAudio').addEventListener('click', this.togglePlay.bind(this));
        this.el.querySelector('.audio').addEventListener('timeupdate', this.initProgressBar.bind(this));
    }

    
}