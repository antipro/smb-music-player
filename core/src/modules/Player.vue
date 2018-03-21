<template>
  <div class="player">
    <search></search>
    <control></control>
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
