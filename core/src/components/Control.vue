<template>
  <div class="control">
    <button
      class="mdc-fab mdc-fab--mini material-icons"
      aria-label="Skip Previous"
      @click="previous">
      <span class="mdc-fab__icon">skip_previous</span>
    </button>
    <button
      class="mdc-fab material-icons play-btn"
      aria-label="Play Or Pause"
      @click="togglePlay">
      <span v-if="playing" class="mdc-fab__icon">pause</span>
      <span v-else class="mdc-fab__icon">play_arrow</span>
    </button>
    <button
      class="mdc-fab mdc-fab--mini material-icons"
      aria-label="Skip Next"
      @click="next">
      <span class="mdc-fab__icon">skip_next</span>
    </button>
    <div class="progress-bar">
      <div role="progressbar" class="mdc-linear-progress" @click="seek">
        <div class="mdc-linear-progress__buffering-dots"></div>
        <div class="mdc-linear-progress__buffer"></div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar" :style="{ transform: progress }">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
      </div>
      <p class="message">{{ status }}</p>
    </div>
  </div>
</template>

<style>
.control {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #ff6659;
}
.control .mdc-fab {
  margin: 15px 3px;
}
.control .play-btn {
  font-size: 48px;
}
.control .progress-bar {
  flex-grow: 1;
  margin: 3px;
  background-color: #FFF;
  height: 5px;
  border-radius: 2px;
}
.control .progress-bar .progress {
  background-color: #772b96;
  border-radius: 2px;
  height: 100%;
}
.control .progress-bar .message {
  width: 100%;
  word-wrap: break-word;
  word-break: break-word;
  margin: 5px 0;
}
</style>

<script>
var mediaTimer = 0
var audioPlayer = null
export default {
  name: 'control',
  data () {
    return {
      playing: false,
      status: '',
      progress: 'scaleX(0)'
    }
  },
  props: ['bus'],
  created () {
    this.bus.$on('select', (file) => {
      this.play(file)
    })
  },
  methods: {
    togglePlay () {
      if (audioPlayer === null) {
        return
      }
      if (this.playing === true) {
        audioPlayer.pause()
      }
      if (this.playing === false) {
        audioPlayer.play()
      }
    },
    play (url) {
      if (!window.cifs) {
        return
      }
      if (audioPlayer) {
        audioPlayer.stop()
      }
      this.currentUrl = url
      window.cifs.download(url, (res) => {
        if (this.currentUrl !== url) {
          return
        }
        if (res.status === 'downloading') {
          this.status = `Buffering(${res.percent})...`
        }
        if (res.status === 'finished') {
          this.status = ''
          audioPlayer = new window.Media(window.cordova.file.cacheDirectory + res.filename, () => {
            this.playing = false
          }, mediaError => {
            console.log(JSON.stringify(mediaError))
          }, mediaStatus => {
            this.changeStatus(mediaStatus)
          })
          audioPlayer.play()
        }
      }, (error) => {
        this.currentUrl = ''
        console.log(error)
      })
    },
    previous () {
      console.log('Previous')
    },
    next () {
      console.log('Next')
    },
    changeStatus (mediaStatus) {
      switch (mediaStatus) {
        case window.Media.MEDIA_STARTING:
          console.log('starting')
          break
        case window.Media.MEDIA_RUNNING:
          console.log('running')
          this.playing = true
          mediaTimer = setInterval(() => {
            audioPlayer.getCurrentPosition(position => {
              let duration = audioPlayer.getDuration()
              if (duration === -1) {
                return
              }
              let percent = position / duration
              this.progress = `scaleX(${percent})`
              this.status = percent + '%'
            }, error => {
              console.log(error)
            })
          }, 1000)
          break
        case window.Media.MEDIA_PAUSED:
          console.log('paused')
          this.playing = false
          break
        case window.Media.MEDIA_STOPPED:
          clearInterval(mediaTimer)
          this.status = ''
          this.progress = 'scaleX(0)'
          this.playing = false
          console.log('stopped')
          break
        default:
          console.log('None')
      }
    },
    seek (evt) {
      if (!audioPlayer) {
        return
      }
      let duration = audioPlayer.getDuration()
      if (duration === -1) {
        return
      }
      var percent = evt.offsetX / evt.currentTarget.clientWidth
      audioPlayer.seekTo(duration * 1000 * percent)
    }
  }
}
</script>
