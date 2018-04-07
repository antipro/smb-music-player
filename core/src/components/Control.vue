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
      <div role="progressbar" class="mdc-linear-progress" @click="seekTo">
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
  flex-shrink: 0;
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
export default {
  name: 'control',
  data () {
    return {
      msgbus: null,
      playing: false,
      filename: '',
      status: '',
      progress: 'scaleX(0)'
    }
  },
  created () {
    this.msgbus = this.$root.msgbus
    this.msgbus.$off([ 'toggleplay', 'progress', 'status' ])
    this.msgbus.$on('toggleplay', (bool) => {
      this.playing = bool
    })
    this.msgbus.$on('progress', (progress) => {
      this.progress = progress
    })
    this.msgbus.$on('status', (status) => {
      this.status = status
    })
    if (window.Media && this.$root.mediaStatus === window.Media.MEDIA_RUNNING) {
      this.playing = true
    }
  },
  methods: {
    togglePlay () {
      if (this.playing === true) {
        this.$root.pause()
      }
      if (this.playing === false) {
        this.$root.resume()
      }
    },
    seekTo (evt) {
      let percent = evt.offsetX / evt.currentTarget.clientWidth
      this.$root.seekTo(percent)
    },
    previous () {
      this.$root.previous()
    },
    next () {
      this.$root.next()
    }
  }
}
</script>
