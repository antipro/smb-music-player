<template>
  <div class="control">
    <button class="mdc-fab mdc-fab--mini material-icons" aria-label="Skip Previous">
      <span class="mdc-fab__icon">
        skip_previous
      </span>
    </button>
    <button class="mdc-fab material-icons" aria-label="Play Arrow">
      <span class="mdc-fab__icon play_icon">
        play_arrow
      </span>
    </button>
    <button class="mdc-fab mdc-fab--mini material-icons" aria-label="Skip Next">
      <span class="mdc-fab__icon">
        skip_next
      </span>
    </button>
    <div class="progress-bar">
      <div class="progress" style="width: 0%;"></div>
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
.control .mdc-fab .play_icon {
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
</style>

<script>
import { MDCRipple } from '@material/ripple'

const $$ = (selector) => {
  return document.querySelectorAll(selector)
}
export default {
  name: 'control',
  data () {
    return {}
  },
  mounted () {
    $$('.mdc-fab').forEach(ele => {
      MDCRipple.attachTo(ele)
      ele.addEventListener('click', function () {
        console.log(this.textContent)
      })
    })
  }
}
</script>
