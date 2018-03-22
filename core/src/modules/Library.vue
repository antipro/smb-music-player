<template>
  <div class="library">
    <h1>Library</h1>
    <button class="mdc-button" data-mdc-auto-init="MDCRipple" @click="open('https://material-components-web.appspot.com')">Material Design</button>
    <button class="mdc-button">
      Button
    </button>
    <button class="mdc-button mdc-button--raised"  data-mdc-auto-init="MDCRipple">
      <i class="material-icons mdc-button__icon">favorite</i>
      Button
    </button>
    <button class="mdc-fab material-icons" data-mdc-auto-init="MDCRipple" aria-label="Favorite">
      <span class="mdc-fab__icon">
        favorite
      </span>
    </button>
    <ul class="mdc-list mdc-list--two-line">
      <li class="mdc-list-item" data-mdc-auto-init="MDCRipple">
        <span class="mdc-list-item__text">
          First-line text
          <span class="mdc-list-item__secondary-text">
            Second-line text
          </span>
        </span>
      </li>
      <li class="mdc-list-item" data-mdc-auto-init="MDCRipple">
        <span class="mdc-list-item__text">
          First-line text
          <span class="mdc-list-item__secondary-text">
            Second-line text
          </span>
        </span>
      </li>
      <li class="mdc-list-item" data-mdc-auto-init="MDCRipple">
        <span class="mdc-list-item__text">
          First-line text
          <span class="mdc-list-item__secondary-text">
            Second-line text
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import mdcAutoInit from '@material/auto-init'

export default {
  name: 'library',
  data () {
    return {}
  },
  mounted () {
    mdcAutoInit()
  },
  methods: {
    open (url) {
      window.cordova.InAppBrowser.open(url, '_blank', 'location=yes')
    }
  }
}
</script>
