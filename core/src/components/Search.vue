<template>
  <div class="search">
    <div class="mdc-text-field mdc-text-field--box mdc-text-field--with-leading-icon">
      <i class="material-icons mdc-text-field__icon">search</i>
      <input
        type="text"
        id="search-input"
        class="mdc-text-field__input"
        v-model="$root.phrase"
        @focus="focused = true"
        @blur="focused = false">
      <label
        for="search-input"
        class="mdc-floating-label"
        :class="{ 'mdc-floating-label--float-above': $root.phrase !== '' || focused }">Search...</label>
      <i
        v-show="$root.phrase !== ''"
        class="material-icons mdc-text-field__icon"
        style="right: 15px; left: initial"
        tabindex="0"
        @click="$root.phrase = ''">clear</i>
      <div class="mdc-text-field__bottom-line"></div>
    </div>
    <ul class="mdc-list mdc-list--two-line mdc-list--avatar-list">
      <li
        class="mdc-list-item"
        data-mdc-auto-init="MDCRipple"
        v-for="file in filelist"
        :key="file.id"
        :class="{ 'mdc-list-item--selected': $root.currentFile.id === file.id }"
        @click="select(file)"
        tabindex="0">
        <span class="mdc-list-item__graphic" role="presentation">
          <i v-if="$root.currentFile.id === file.id" class="material-icons" aria-hidden="true">play_circle_outline</i>
          <i v-else class="material-icons" aria-hidden="true">audiotrack</i>
        </span>
        <span class="mdc-list-item__text">
          {{ file.name }}
          <span class="mdc-list-item__secondary-text">
            Size: {{ formatSize(file.length) }}
          </span>
        </span>
        <span
          class="mdc-list-item__meta"
          v-if="file.type === 2 && file.save">
          <i class="material-icons" aria-hidden="true">save</i>
        </span>
        <span
          class="mdc-list-item__meta"
          v-if="file.type === 2 && file.percent">
          {{ file.percent }}
        </span>
        <span
          class="mdc-list-item__meta"
          v-if="file.type === 1">
          <i class="material-icons" aria-hidden="true">phone_android</i>
        </span>
      </li>
    </ul>
    <ul v-show="filelist.length === 0" class="action-btn mdc-list">
      <li class="mdc-list-item">
        <button class="mdc-button" @click="$root.phrase = ':cached'">
          Cached
        </button>
      </li>
      <li class="mdc-list-item">
        <button class="mdc-button" @click="$root.phrase = ':random'">
          Random
        </button>
      </li>
    </ul>
  </div>
</template>

<style>
.search {
  overflow-y: auto;
}
.search .mdc-text-field {
  margin-top: 0;
  display: block;
}
.search .action-btn .mdc-list-item {
  justify-content: center;
}
</style>

<script>
import { formatSize } from '../utils'

export default {
  name: 'search',
  data () {
    return {
      msgbus: null,
      focused: false
    }
  },
  created () {
    this.msgbus = this.$root.msgbus
    this.msgbus.$off([ 'next', 'previous', 'preload', 'reset', 'random' ])
    this.msgbus.$on('next', () => {
      let idx = this.filelist.findIndex(file => {
        return file.id === this.$root.currentFile.id
      })
      if (idx === undefined) {
        return
      }
      if (idx + 1 === this.filelist.length) {
        idx = -1
      }
      let file = this.filelist[++idx]
      if (!file) {
        return
      }
      console.log('next', file)
      this.select(file)
    })
    this.msgbus.$on('random', () => {
      let length = this.filelist.length
      let idx = parseInt(Math.random() * length)
      let file = this.filelist[idx]
      if (!file) {
        return
      }
      console.log('random', file)
      this.select(file)
    })
    this.msgbus.$on('previous', () => {
      let idx = this.filelist.findIndex(file => {
        return file.id === this.$root.currentFile.id
      })
      if (idx === undefined) {
        return
      }
      if (idx === 0) {
        idx = this.filelist.length
      }
      let file = this.filelist[--idx]
      if (!file) {
        return
      }
      console.log('previous', file)
      this.select(file)
    })
    this.msgbus.$on('preload', () => {
      let idx = this.filelist.findIndex(file => {
        return file.id === this.$root.currentFile.id
      })
      if (idx === undefined) {
        return
      }
      let file = this.filelist[++idx]
      if (!file) {
        return
      }
      if (file.type !== 2) {
        return
      }
      this.$root.load(file)
    })
    this.msgbus.$on('reset', () => {
      let bak = this.$root.phrase
      this.$root.phrase = ''
      setTimeout(() => {
        this.$root.phrase = bak
      }, 500)
    })
  },
  methods: {
    formatSize: formatSize,
    select (file) {
      switch (file.type) {
        case 0:
          // TODO play localhost music just for test
          break
        case 1:
          this.$root.playLocalFile(file)
          break
        case 2:
          this.$root.playSmbFile(file)
      }
    }
  },
  computed: {
    filelist () {
      return this.$root.filelist
    }
  }
}
</script>
