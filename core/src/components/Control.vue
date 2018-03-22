<template>
  <div class="control">
    <button id="previous_btn" class="mdc-fab mdc-fab--mini material-icons" aria-label="Skip Previous">
      <span class="mdc-fab__icon">skip_previous</span>
    </button>
    <button id="play_btn" class="mdc-fab material-icons" aria-label="Play Or Pause">
      <span class="mdc-fab__icon">play_arrow</span>
    </button>
    <button id="next_btn" class="mdc-fab mdc-fab--mini material-icons" aria-label="Skip Next">
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
.control #play_btn {
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
const $ = (selector) => {
  return document.querySelector(selector)
}
export default {
  name: 'control',
  data () {
    return {}
  },
  mounted () {
    $('#play_btn').addEventListener('click', function () {
      let text = $('#play_btn .mdc-fab__icon').textContent
      console.log(text)
      if (text === 'play_arrow') {
        $('#play_btn .mdc-fab__icon').textContent = 'pause'
      } else {
        $('#play_btn .mdc-fab__icon').textContent = 'play_arrow'
      }
    })
  }
}
</script>
