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
    <ul class="mdc-list mdc-list--two-line">
      <li
        class="mdc-list-item"
        data-mdc-auto-init="MDCRipple"
        v-for="file in filelist"
        :key="file.id"
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
import db from '../database'
import { formatSize } from '../utils'

export default {
  name: 'search',
  data () {
    return {
      msgbus: null,
      phrase: '',
      focused: false,
      selectedId: 0,
      filelist: []
    }
  },
  created () {
    this.msgbus = this.$root.msgbus
    this.msgbus.$on('position', file => {
      this.selectedId = file.id
    })
    this.msgbus.$on('next', () => {
      let idx = this.filelist.findIndex(file => {
        return file.id === this.selectedId
      })
      if (idx === -1) {
        return
      }
      let file = this.filelist[++idx]
      if (!file) {
        return
      }
      this.select(file)
    })
    this.msgbus.$on('previous', () => {
      let idx = this.filelist.findIndex(file => {
        return file.id === this.selectedId
      })
      if (idx === -1) {
        return
      }
      let file = this.filelist[--idx]
      if (!file) {
        return
      }
      this.select(file)
    })
    if (this.$root.currentFile) {
      this.selectedId = this.$root.currentFile.id
    }
  },
  methods: {
    formatSize: formatSize,
    select (file) {
      console.log(file.type)
      switch (file.type) {
        case 0:
          // TODO play localhost music just for test
          break
        case 1:
          // TODO play music from sdcard
          break
        case 2:
          this.$root.playSmbFile(file)
      }
    }
  },
  computed: {
  },
  watch: {
    phrase (val) {
      if (this.phrase === '') {
        this.filelist = []
        return
      }
      let fidlist = this.$root.directorylist.filter(directory => directory.reachable).map(directory => directory.id)
      if (fidlist.length === 0) {
        this.filelist = []
        return
      }
      let regex = new RegExp(this.phrase, 'i')
      db.files.where('fid').anyOf(fidlist).filter(file => regex.test(file.name)).limit(30).toArray(filelist => {
        this.filelist = filelist
      })
    }
  }
}
</script>
