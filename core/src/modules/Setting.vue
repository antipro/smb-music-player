<template>
  <div class="setting">
    <h3>Cache Limit <small>{{ $root.cachelimit }}</small></h3>
    <div
      id="cache_limit"
      class="mdc-slider mdc-slider--discrete"
      tabindex="0"
      role="slider"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="$root.cachelimit"
      aria-label="Select Value">
      <div class="mdc-slider__track-container">
        <div class="mdc-slider__track"></div>
      </div>
      <div class="mdc-slider__thumb-container">
        <div class="mdc-slider__pin">
          <span class="mdc-slider__pin-value-marker"></span>
        </div>
        <svg class="mdc-slider__thumb" width="21" height="21">
          <circle cx="10.5" cy="10.5" r="7.875"></circle>
        </svg>
        <div class="mdc-slider__focus-ring"></div>
      </div>
    </div>
    <h3>Search Limit <small>{{ $root.searchlimit }}</small></h3>
    <div
      id="search_limit"
      class="mdc-slider mdc-slider--discrete"
      tabindex="0"
      role="slider"
      aria-valuemin="30"
      aria-valuemax="100"
      :aria-valuenow="$root.searchlimit"
      aria-label="Select Value">
      <div class="mdc-slider__track-container">
        <div class="mdc-slider__track"></div>
      </div>
      <div class="mdc-slider__thumb-container">
        <div class="mdc-slider__pin">
          <span class="mdc-slider__pin-value-marker"></span>
        </div>
        <svg class="mdc-slider__thumb" width="21" height="21">
          <circle cx="10.5" cy="10.5" r="7.875"></circle>
        </svg>
        <div class="mdc-slider__focus-ring"></div>
      </div>
    </div>
    <h3>Play Mode</h3>
    <div class="mdc-form-field">
      <div class="mdc-radio">
        <input class="mdc-radio__native-control" type="radio" id="loop_1" value="0" v-model.number="$root.playmode">
        <div class="mdc-radio__background">
          <div class="mdc-radio__outer-circle"></div>
          <div class="mdc-radio__inner-circle"></div>
        </div>
      </div>
      <label for="loop_1">No Loop</label>
    </div>
    <div class="mdc-form-field">
      <div class="mdc-radio">
        <input class="mdc-radio__native-control" type="radio" id="loop_2" value="1" v-model.number="$root.playmode">
        <div class="mdc-radio__background">
          <div class="mdc-radio__outer-circle"></div>
          <div class="mdc-radio__inner-circle"></div>
        </div>
      </div>
      <label for="loop_2">One Loop</label>
    </div>
    <div class="mdc-form-field">
      <div class="mdc-radio">
        <input class="mdc-radio__native-control" type="radio" id="loop_3" value="2" v-model.number="$root.playmode">
        <div class="mdc-radio__background">
          <div class="mdc-radio__outer-circle"></div>
          <div class="mdc-radio__inner-circle"></div>
        </div>
      </div>
      <label for="loop_3">Playlist Loop</label>
    </div>
    <div class="mdc-form-field">
      <div class="mdc-radio">
        <input class="mdc-radio__native-control" type="radio" id="loop_4" value="3" v-model.number="$root.playmode">
        <div class="mdc-radio__background">
          <div class="mdc-radio__outer-circle"></div>
          <div class="mdc-radio__inner-circle"></div>
        </div>
      </div>
      <label for="loop_4">Random</label>
    </div>
  </div>
</template>

<style>
.setting { padding: 15px; }
.setting .mdc-form-field { display: flex; }
</style>

<script>
import { MDCSlider } from '@material/slider'

export default {
  name: 'setting',
  created () {
    this.$parent.title = 'Setting'
  },
  mounted () {
    const cacheSlider = new MDCSlider(document.querySelector('#cache_limit'))
    cacheSlider.listen('MDCSlider:change', () => {
      this.$root.cachelimit = cacheSlider.value
    })
    const searchSlider = new MDCSlider(document.querySelector('#search_limit'))
    searchSlider.listen('MDCSlider:change', () => {
      this.$root.searchlimit = searchSlider.value
    })
  }
}
</script>
