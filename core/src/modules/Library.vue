<template>
  <div class="library">
    <ul class="mdc-list mdc-list--two-line">
      <li
        class="mdc-list-item"
        v-for="directory in directorylist"
        :key="directory.id">
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
        <div
          class="btn-group"
          v-show="directory.inprogress === undefined">
          <span
            class="mdc-list-item__meta material-icons"
            aria-label="Refresh Directory"
            title="Sync"
            v-if="directory.reachable"
            @click.stop="$root.updateDir(directory)">
            sync
          </span>
          <span
            class="mdc-list-item__meta material-icons"
            aria-label="Refresh Directory"
            title="Sync disabled"
            v-else>
            sync_disabled
          </span>
          <span
            class="mdc-list-item__meta material-icons"
            aria-label="Delete Directory"
            title="Delete"
            @click.stop="$root.removeDir(directory)">
            delete
          </span>
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
      </li>
    </ul>
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
.library .mdc-list-item .mdc-linear-progress {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
}
.library .mdc-list-item .btn-group {
  position: absolute; right: 0; top: 0; font-size: 48px;
}
.library .mdc-list-item .btn-group * {
  font-size: 36px;
}
</style>

<script>
export default {
  name: 'library',
  created () {
    this.$parent.title = 'Library'
  },
  computed: {
    directorylist () {
      return this.$root.directorylist
    }
  }
}
</script>
