<template>
  <div class="search">
    <div class="mdc-text-field mdc-text-field--with-leading-icon">
      <i class="material-icons mdc-text-field__icon" tabindex="0">search</i>
      <input type="text" id="my-input" class="mdc-text-field__input">
      <label for="my-input" class="mdc-floating-label">Song Name</label>
      <div class="mdc-text-field__bottom-line"></div>
    </div>
    <ul class="mdc-list mdc-list--two-line">
      <li
        class="mdc-list-item"
        data-mdc-auto-init="MDCRipple"
        v-for="song in songlist"
        :key="song.name">
        <span class="mdc-list-item__graphic" role="presentation">
          <i class="material-icons" aria-hidden="true">audiotrack</i>
        </span>
        <span class="mdc-list-item__text">
          {{ song.name }}
          <span class="mdc-list-item__secondary-text">
            Size: {{ song.size }}
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
</style>

<script>
export default {
  name: 'search',
  data () {
    return {
      songlist: [ {
        name: 'Blue - On Love.mp3',
        size: 10000,
        url: ''
      }, {
        name: 'Backstreet Boys - Everybody.mp3',
        size: 10000,
        url: ''
      }, {
        name: 'Kate Perry - Let it go.mp3',
        size: 10000,
        url: ''
      } ]
    }
  }
}
</script>
