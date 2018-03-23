<template>
  <div class="library">
    <ul class="mdc-list mdc-list--two-line">
      <li
        class="mdc-list-item"
        data-mdc-auto-init="MDCRipple"
        v-for="directory in directorylist"
        :key="directory.url">
        <span class="mdc-list-item__graphic" role="presentation">
          <i class="material-icons" aria-hidden="true">folder</i>
        </span>
        <span class="mdc-list-item__text">
          {{ directory.name }}
          <span class="mdc-list-item__secondary-text">
            Files: {{ directory.files }}
          </span>
          <span class="mdc-list-item__secondary-text">
            Url: {{ directory.url }}
          </span>
        </span>
      </li>
    </ul>
    <router-link
      class="mdc-fab material-icons app-fab--absolute"
      aria-label="Microphone"
      data-mdc-auto-init="MDCRipple"
      :to="{ name: 'auth' }">
      <span class="mdc-fab__icon">add</span>
    </router-link>
  </div>
</template>

<style>
.library .app-fab--absolute {
  position: fixed;
  bottom: 100px;
  right: 1rem;
}

@media(min-width: 1024px) {
   .library .app-fab--absolute {
    bottom: 150px;
    right: 1.5rem;
  }
}
</style>

<script>
import mdcAutoInit from '@material/auto-init'

export default {
  name: 'library',
  data () {
    return {
      directorylist: [ {
        name: 'Music',
        files: 10000,
        url: 'smb://192.168.1.4/Public/Music'
      }, {
        name: 'Music',
        files: 300,
        url: 'smb://192.168.0.144/Music'
      } ]
    }
  },
  created () {
    this.$parent.title = 'Library'
  },
  updated () {
    mdcAutoInit()
  }
}
</script>
