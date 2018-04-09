<template>
  <div class="library">
    <div
      class="mdc-card"
      v-for="directory in directorylist"
      :key="directory.id">
      <div class="mdc-card__primary">
        <h2 class="mdc-typography--title">
          <i v-if="directory.type === 0" class="material-icons" aria-hidden="true">http</i>
          <i v-if="directory.type === 1" class="material-icons" aria-hidden="true">phone_android</i>
          <i v-if="directory.type === 2" class="material-icons" aria-hidden="true">storage</i>
          {{ directory.name }}
        </h2>
        <h5>Files: {{ directory.files }}</h5>
      </div>
      <div class="mdc-typography--body1">
        Url: {{ transform(directory.url) }}
      </div>
      <div class="mdc-card__actions">
        <div
          class="mdc-switch">
          <input
            type="checkbox"
            class="mdc-switch__native-control"
            v-model="directory.reachable"/>
          <div class="mdc-switch__background">
            <div class="mdc-switch__knob"></div>
          </div>
        </div>
        <div
          class="mdc-card__action-icons"
          v-show="!directory.inprogress">
          <i
            class="material-icons mdc-card__action mdc-card__action--icon"
            tabindex="0"
            role="button"
            title="Sync"
            aria-label="Sync Directory"
            v-if="directory.reachable"
            @click.stop="update(directory)">sync</i>
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
        v-show="directory.inprogress === true">
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
      class="mdc-fab mdc-fab--mini material-icons app-fab--absolute"
      aria-label="Folder"
      :to="{ name: 'folder' }"
      :class="{ 'app-fab-expand2': expanded }">
      <span class="mdc-fab__icon">phone_android</span>
    </router-link>
    <router-link
      class="mdc-fab mdc-fab--mini material-icons app-fab--absolute"
      aria-label="Storage"
      :to="{ name: 'auth' }"
      :class="{ 'app-fab-expand1': expanded }">
      <span class="mdc-fab__icon">storage</span>
    </router-link>
    <button
      class="mdc-fab material-icons app-fab--absolute"
      aria-label="Add"
      @click="expanded = !expanded"
      :class="{ 'app-fab-collapse': expanded }">
      <span class="mdc-fab__icon">add</span>
    </button>
  </div>
</template>

<style>
.library .app-fab--absolute {
  position: fixed; bottom: 100px; right: 1.0rem;
}
.library .mdc-fab--mini {
  bottom: 110px; right: 1.5rem;
}
@media(min-width: 1024px) {
  .library .app-fab--absolute {
    bottom: 150px; right: 1.5rem;
  }
  .library .mdc-fab--mini {
    bottom: 160px; right: 2.0rem;
  }
}
.library .app-fab-expand1 {
  transition-timing-function: cubic-bezier(.4, 0, 1, 1);
  transform: translateY(-60px)
}
.library .app-fab-expand2 {
  transition-timing-function: cubic-bezier(.4, 0, 1, 1);
  transform: translateY(-110px)
}
.library .app-fab-collapse {
  transition-timing-function: cubic-bezier(.4, 0, 1, 1);
  transform: rotate(45deg);
}
.library .mdc-card {
  margin: 15px;
  position: relative;
}
.library .mdc-card .mdc-card__primary {
  padding: .5em 1em;
}
.library .mdc-card .mdc-card__primary h2 {
  display: flex;
  align-items: center;
}
.library .mdc-card .mdc-card__primary h2 .material-icons {
  margin-right: 5px;
}
.library .mdc-card .mdc-card__primary .material-icons {
  vertical-align: middle;
}
.library .mdc-card .mdc-card__primary > *{
  margin: .3em auto;
}
.library .mdc-card .mdc-typography--body1 {
  padding: .3em 1em;
  word-wrap: break-word;
  word-break: break-all;
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
  data () {
    return {
      expanded: false
    }
  },
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
    },
    update (directory) {
      if (directory.type === 1) {
        this.$root.updateFolder(directory)
      }
      if (directory.type === 2) {
        this.$root.updateDir(directory)
      }
    }
  },
  computed: {
    directorylist () {
      return this.$root.directorylist
    }
  }
}
</script>
