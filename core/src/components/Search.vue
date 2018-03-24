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
        :class="{ 'mdc-floating-label--float-above': floated }">Song Name</label>
      <div class="mdc-text-field__bottom-line"></div>
    </div>
    <ul class="mdc-list mdc-list--two-line">
      <li
        class="mdc-list-item"
        data-mdc-auto-init="MDCRipple"
        v-for="file in filter(filelist)"
        :key="file.id">
        <span class="mdc-list-item__graphic" role="presentation">
          <i class="material-icons" aria-hidden="true">audiotrack</i>
        </span>
        <span class="mdc-list-item__text">
          {{ file.name }}
          <span class="mdc-list-item__secondary-text">
            Length: {{ file.length }}
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

export default {
  name: 'search',
  data () {
    return {
      phrase: '',
      focused: false,
      filelist: []
    }
  },
  created () {
    this.showFiles()
  },
  methods: {
    filter (filelist) {
      if (this.phrase === '') {
        return filelist
      }
      return filelist.filter(file => {
        return file.name.toLowerCase().indexOf(this.phrase.toLowerCase()) > -1
      })
    },
    async showFiles () {
      this.filelist = await db.files.toArray()
    }
  },
  computed: {
    floated () {
      return this.phrase !== '' || this.focused
    }
  }
}
</script>
