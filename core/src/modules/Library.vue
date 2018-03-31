<template>
  <div class="library">
    <div
      class="mdc-card"
      v-for="directory in directorylist"
      :key="directory.id">
      <div class="mdc-card__primary">
        <h2 class="mdc-typography--title">
          <i v-if="directory.type === 0" class="material-icons" aria-hidden="true">folder</i>
          <i v-if="directory.type === 1" class="material-icons" aria-hidden="true">folder</i>
          <i v-if="directory.type === 2" class="material-icons" aria-hidden="true">storage</i>
          {{ directory.name }}
        </h2>
        <h5>Files: {{ directory.files }}</h5>
      </div>
      <div class="mdc-typography--body1">
        Url: {{ transform(directory.url) }}
      </div>
      <div class="mdc-card__actions">
        <div class="mdc-switch">
          <input
            type="checkbox"
            class="mdc-switch__native-control"
            v-model="directory.reachable"/>
          <div class="mdc-switch__background">
            <div class="mdc-switch__knob"></div>
          </div>
        </div>
        <div class="mdc-card__action-icons">
          <i
            class="material-icons mdc-card__action mdc-card__action--icon"
            tabindex="0"
            role="button"
            title="Sync"
            aria-label="Sync Directory"
            v-if="directory.reachable"
            @click.stop="$root.updateDir(directory)">sync</i>
          <i
            class="material-icons mdc-card__action mdc-card__action--icon"
            tabindex="0"
            role="button"
            title="Sync disabled"
            v-else>sync_disabled</i>
          <i
            class="material-icons mdc-card__action mdc-card__action--icon"
            tabindex="0"
            role="button"
            title="Delete"
            aria-label="Delete Directory"
            @click.stop="$root.removeDir(directory)">delete</i>
        </div>
      </div>
      <div
        role="progressbar"
        class="mdc-linear-progress mdc-linear-progress--indeterminate"
        v-show="directory.inprogress">
        <div class="mdc-linear-progress__buffering-dots"></div>
        <div class="mdc-linear-progress__buffer"></div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
      </div>
    </div>
    <router-link
      class="mdc-fab material-icons app-fab--absolute"
      aria-label="Add"
      :to="{ name: 'auth' }">
      <span class="mdc-fab__icon">add</span>
    </router-link>
  </div>
</template>

<style>
.library .app-fab--absolute {
  position: fixed; bottom: 100px; right: 1rem;
}
@media(min-width: 1024px) {
   .library .app-fab--absolute {
    bottom: 150px; right: 1.5rem;
  }
}
.library .mdc-card {
  margin: 15px;
  position: relative;
}
.library .mdc-card .mdc-card__primary {
  padding: .5em 1em;
}
.library .mdc-card .mdc-card__primary > *{
  margin: .3em auto;
}
.library .mdc-card .mdc-typography--body1 {
  padding: .3em 1em;
  word-wrap: break-word;
}
.library .mdc-card .mdc-switch {
  padding: 12px
}
.library .mdc-card .mdc-linear-progress {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
}
</style>

<script>
export default {
  name: 'library',
  created () {
    this.$parent.title = 'Library'
  },
  methods: {
    transform (url) {
      let m = url.match(/\/\/.+@/ig)
      if (m) {
        return url.replace(m[0], '//***@')
      }
      return url
    }
  },
  computed: {
    directorylist () {
      return this.$root.directorylist
    }
  }
}
</script>
