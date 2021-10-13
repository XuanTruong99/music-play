// Render songs => ok
// Scroll top => ok
// Play/ pause/seak => ok
// CD rotate => ok
// Next/ prev => ok
// Random => ok
// Next/ Repeat when ended => ok
// Active song => ok
// Scroll active song into view => ok
// Play song when click
// Storage display icon
const $ =  document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const KEY_STOREAGE_KEY = 'Spider music'

const playList = $('.playlist');
const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const heading = $('header h2')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(KEY_STOREAGE_KEY)) || {},
    songs: [
        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: './asset/music/Vicetone - Nevada (ft. Cozi Zuehlsdorff).mp3',
            image: './asset/img/9.jpg'
        },
        {
            name: 'Bước qua mùa cô đơn',
            singer: 'Vũ',
            path: './asset/music/[lyrics] bước qua mùa cô đơn - vũ - mùa thu rơi vào em ....mp3',
            image: './asset/img/1.jpg'
        },
        {
            name: 'Heartbreak Anniversary',
            singer: 'Giveon',
            path: './asset/music/[Vietsub+Lyrics] Heartbreak Anniversary - Giveon.mp3',
            image: './asset/img/2.jpg'
        },
        {
            name: 'Like My Father',
            singer: 'Jax',
            path: './asset/music/[Vietsub+Lyrics] Like My Father - Jax.mp3',
            image: './asset/img/5.jpg'
        },
        {
            name: 'River',
            singer: 'Charlie Puth',
            path: './asset/music/[Vietsub+Lyrics] River - Charlie Puth.mp3',
            image: './asset/img/7.jpg'
        },
        {
            name: 'comethru',
            singer: 'Jeremy Zucker',
            path: './asset/music/Jeremy Zucker - comethru (Official Video).mp3',
            image: './asset/img/3.jpg'
        },
        {
            name: 'Summertime',
            singer: 'K-391',
            path: './asset/music/K-391 - Summertime [Sunshine].mp3',
            image: './asset/img/4.jpg'
        },
        {
            name: 'Happy For You (feat. Vũ.)',
            singer: 'Lukas Graham- Vũ',
            path: './asset/music/Lukas Graham - Happy For You (feat. Vũ.) Performance Video.mp3',
            image: './asset/img/6.jfif'
        },
        {
            name: 'Monody (feat. Laura Brehm)',
            singer: 'TheFatRat',
            path: './asset/music/TheFatRat - Monody (feat. Laura Brehm).mp3',
            image: './asset/img/8.jpg'
        }
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(KEY_STOREAGE_KEY, JSON.stringify(this.config))
    },
    // Render HTML
    render: function() {
        const html = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url(${song.image})"></div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
            `
        })
        playList.innerHTML = html.join('')
    },
    // Handle event
    handleEvents: function() {
        const _this = this;
        // Phóng to thu nhỏ CD
        const cdWidth = cd.offsetWidth;
        document.onscroll = function() {
            const scrollHeight = document.documentElement.scrollTop || window.scrollY;
            const newCDWidth = cdWidth - scrollHeight;

            cd.style.width = newCDWidth > 0 ? newCDWidth + 'px' : 0;
            cd.style.opacity = newCDWidth / cdWidth
        }
        // Xử lý Cd quay và dừng:
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        // Click playing song
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // When being playing song
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // When being pausing song
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Progress input element run
        audio.ontimeupdate = function() {
            if (audio.duration) {
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
            progress.value = progressPercent
            }
        }
        // Tua song
        progress.onchange = function(e) {
            const seakTime = audio.duration / 100 * e.target.value
            audio.currentTime = seakTime
        }
        // Next songs
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // Prev songs
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // Random songs
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Ended next songs
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        // Repeat song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // Play song when click in playList
        playList.onclick = function(e) {
            const songNodes = e.target.closest('.song:not(.active)')
            if(songNodes || e.target.closest('.option')) {
                if(songNodes) {
                    _this.currentIndex = Number(songNodes.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }

    },
    // DefineCurrentSong
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }, 300) 
            
    },

    // Load currentsong
    loadCurrentSong: function () {
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        heading.textContent = this.currentSong.name
        audio.src = this.currentSong.path

    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat; 
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let randomIndexsong
        do {
            randomIndexsong = Math.floor(Math.random() * this.songs.length)
        } while(randomIndexsong === this.currentIndex)
        this.currentIndex = randomIndexsong
        this.loadCurrentSong()
    },
    
    start: function() {
        // Load config
        this.loadConfig()
        // Define song
        this.defineProperties()
        // Render playlist
        this.render()
        // Xử lý handle
        this.handleEvents()
        // Load CurrentSong
        this.loadCurrentSong()

        repeatBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)
    },
}

app.start()