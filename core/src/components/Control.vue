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
      <div class="progress" style="width: 0%;"></div>
      <p class="message">Buffering...</p>
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
export default {
  name: 'control',
  data () {
    return {
      playing: false
    }
  },
  mounted () {
  },
  methods: {
    togglePlay () {
      this.playing = !this.playing
    },
    previous () {
      console.log('Previous')
    },
    next () {
      console.log('Next')
    }
  }
}
</script>
