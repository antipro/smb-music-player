<template>
  <div class="setting">
    <h1>Setting</h1>
    <h3>Cache Limit <small>{{ $root.cachelimit }}</small></h3>
    <div
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
  </div>
</template>

<style>
.setting { padding: 15px; }
</style>

<script>
import { MDCSlider } from '@material/slider'

export default {
  name: 'setting',
  mounted () {
    const slider = new MDCSlider(document.querySelector('.mdc-slider'))
    slider.listen('MDCSlider:change', () => {
      this.$root.cachelimit = slider.value
    })
  }
}
</script>
