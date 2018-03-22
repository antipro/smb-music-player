<template>
  <div class="library">
    <h1>Library</h1>
    <button class="mdc-button" @click="open('https://material-components-web.appspot.com')">Material Design</button>
    <button class="mdc-button">
      Button
    </button>
    <button class="mdc-button mdc-button--raised">
      <i class="material-icons mdc-button__icon">favorite</i>
      Button
    </button>
    <button class="mdc-fab material-icons" aria-label="Favorite">
      <span class="mdc-fab__icon">
        favorite
      </span>
    </button>
    <ul class="mdc-list mdc-list--two-line">
      <li class="mdc-list-item">
        <span class="mdc-list-item__text">
          First-line text
          <span class="mdc-list-item__secondary-text">
            Second-line text
          </span>
        </span>
      </li>
      <li class="mdc-list-item">
        <span class="mdc-list-item__text">
          First-line text
          <span class="mdc-list-item__secondary-text">
            Second-line text
          </span>
        </span>
      </li>
      <li class="mdc-list-item">
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
import { MDCRipple } from '@material/ripple'

export default {
  name: 'library',
  data () {
    return {}
  },
  mounted () {
    document.querySelectorAll('.mdc-button').forEach(ele => {
      MDCRipple.attachTo(ele)
    })
    document.querySelectorAll('.mdc-list-item').forEach(ele => {
      MDCRipple.attachTo(ele)
    })
    document.querySelectorAll('.mdc-fab').forEach(ele => {
      MDCRipple.attachTo(ele)
    })
  },
  methods: {
    open (url) {
      window.cordova.InAppBrowser.open(url, '_blank', 'location=yes')
    }
  }
}
</script>
