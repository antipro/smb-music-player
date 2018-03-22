<template>
  <div class="player">
    <search></search>
    <control></control>
    <button class="mdc-fab material-icons app-fab--absolute" aria-label="Microphone" data-mdc-auto-init="MDCRipple">
      <span class="mdc-fab__icon">
        mic
      </span>
    </button>
  </div>
</template>

<style>
.player {
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
}
.player .search { flex: 1; }

.player .app-fab--absolute {
  position: fixed;
  bottom: 100px;
  right: 1rem;
}

@media(min-width: 1024px) {
   .player .app-fab--absolute {
    bottom: 150px;
    right: 1.5rem;
  }
}
</style>

<script>
import Control from '../components/Control'
import Search from '../components/Search'

export default {
  name: 'player',
  data () {
    return {}
  },
  components: {
    Control, Search
  }
}
</script>
