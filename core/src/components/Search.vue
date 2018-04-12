<template>
  <div class="search">
    <div class="mdc-text-field mdc-text-field--box mdc-text-field--with-leading-icon">
      <i class="material-icons mdc-text-field__icon">search</i>
      <input
        type="text"
        id="search-input"
        class="mdc-text-field__input"
        v-model="phrase"
        @focus="focused = true"
        @blur="focused = false">
      <label
        for="search-input"
        class="mdc-floating-label"
        :class="{ 'mdc-floating-label--float-above': phrase !== '' || focused }">Search...</label>
      <i
        v-show="phrase !== ''"
        class="material-icons mdc-text-field__icon"
        style="right: 15px; left: initial"
        tabindex="0"
        @click="phrase = ''">clear</i>
      <div class="mdc-text-field__bottom-line"></div>
    </div>
    <ul class="mdc-list mdc-list--two-line mdc-list--avatar-list">
      <li
        class="mdc-list-item"
        data-mdc-auto-init="MDCRipple"
        v-for="file in filelist"
        :key="file.id"
        :class="{ 'mdc-list-item--selected': selectedId === file.id }"
        @click="select(file)"
        tabindex="0">
        <span class="mdc-list-item__graphic" role="presentation">
          <i v-if="selectedId === file.id" class="material-icons" aria-hidden="true">play_circle_outline</i>
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
          v-if="file.type === 1">
          <i class="material-icons" aria-hidden="true">phone_android</i>
        </span>
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
</style>

<script>
import Vue from 'vue'
import db from '../database'
import { formatSize, resolveURL } from '../utils'

export default {
  name: 'search',
  data () {
    return {
      msgbus: null,
      phrase: '',
      focused: false,
      selectedId: 0
    }
  },
  persist: [ 'phrase' ],
  created () {
    this.msgbus = this.$root.msgbus
    this.msgbus.$off([ 'position', 'next', 'previous', 'preload', 'reset', 'random' ])
    this.msgbus.$on('position', file => {
      this.selectedId = file.id
    })
    this.msgbus.$on('search', phrase => {
      this.phrase = phrase
    })
    this.msgbus.$on('next', () => {
      let idx = this.filelist.findIndex(file => {
        return file.id === this.selectedId
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
        return file.id === this.selectedId
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
        return file.id === this.selectedId
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
      let bak = this.phrase
      this.phrase = ''
      setTimeout(() => {
        this.phrase = bak
      }, 500)
    })
    if (this.$root.currentFile) {
      this.selectedId = this.$root.currentFile.id
    }
  },
  mounted () {
    document.addEventListener('resume', this.checkCache, false)
  },
  beforeDestroy () {
    document.removeEventListener('resume', this.checkCache, false)
  },
  methods: {
    checkCache () {
      this.$root.filelist.forEach(file => {
        resolveURL(window.cordova.file.dataDirectory, 'file_' + file.id).then(url => {
          if (url) {
            Vue.set(file, 'save', true)
          } else {
            Vue.delete(file, 'save')
          }
        })
      })
    },
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
  },
  watch: {
    phrase (val) {
      if (this.phrase === '') {
        this.$root.filelist = []
        return
      }
      let fidlist = []
      for (const directory of this.$root.directorylist) {
        if (directory.reachable) {
          fidlist.push(directory.id)
        }
      }
      // let fidlist = this.$root.directorylist.filter(directory => directory.reachable).map(directory => directory.id)
      if (fidlist.length === 0) {
        this.$root.filelist = []
        return
      }
      let regex = new RegExp(this.phrase, 'i')
      db.files.where('fid').anyOf(fidlist).filter(file => regex.test(file.name)).limit(this.$root.searchlimit).toArray(filelist => {
        this.$root.filelist = filelist
        this.checkCache()
      })
    }
  }
}
</script>
