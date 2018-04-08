<template>
  <div id='app'>
    <header class='header'>
      <button role='tab' class='header__menu' @click="showMenu">
        Toggle nav menu
      </button>

      <h1 class='header__title'>{{ title }}</h1>
    </header>
    <main class='main js-global-main' aria-role='main'>
      <router-view/>
    </main>

    <!-- Loading Dialog For use by Activities -->
    <div class='loader js-global-loader is-hidden'>
      <svg viewBox='0 0 32 32' width='32' height='32'>
        <circle id='spinner' cx='16' cy='16' r='14' fill='none'></circle>
      </svg>
    </div>

    <section class='side-nav' @click="hideMenu" :class="{ 'side-nav--visible': menuVisible }">
      <div class='side-nav__content js-side-nav-content' :style="{ 'transform': transform }">
        <div class='side-nav__header'>
          <h1 class='side-nav__title'>SMB Music</h1>
        </div>
        <div class='side-nav__body'>
          <router-link role='tab' tabindex='0' class='side-nav__player' :to="{ name: 'player' }">Player</router-link>
          <router-link role='tab' tabindex='1' class='side-nav__library' :to="{ name: 'library' }">Library</router-link>
          <router-link role='tab' tabindex='2' class='side-nav__setting' :to="{ name: 'setting' }">Setting</router-link>
          <router-link role='tab' tabindex='3' class='side-nav__about' :to="{ name: 'about' }">About</router-link>
        </div>
      </div>
    </section>

    <aside class='toast-view js-toast-view' :class="{ 'toast-view--visible': message }">{{ message }}</aside>
  </div>
</template>
<style src='./assets/appshell.css'></style>

<style lang="scss">
@import "@material/button/mdc-button";;
@import "@material/fab/mdc-fab";
@import "@material/list/mdc-list";
@import "@material/form-field/mdc-form-field";
@import "@material/textfield/mdc-text-field";
@import "@material/checkbox/mdc-checkbox";
@import "@material/dialog/mdc-dialog";
@import "@material/linear-progress/mdc-linear-progress";
@import "@material/card/mdc-card";
@import "@material/switch/mdc-switch";
@import "@material/slider/mdc-slider";
@import "@material/radio/mdc-radio";

$mdc-theme-primary: #d32f2f;
$mdc-theme-primary-light: #ff6659;
$mdc-theme-primary-dark: #9a0007;

$mdc-theme-secondary: #66bb6a;
$mdc-theme-secondary-light: #98ee99;
$mdc-theme-secondary-dark: #338a3e;
$mdc-theme-background: #ffffff;

@import "@material/theme/mdc-theme";
</style>

<script>
import { MDCRipple } from '@material/ripple'
import mdcAutoInit from '@material/auto-init'

export default {
  name: 'App',
  data () {
    return {
      title: '',
      menuVisible: false,
      transform: 'translateX(-102%)',
      message: ''
    }
  },
  created () {
    mdcAutoInit.deregister('MDCRipple')
    mdcAutoInit.register('MDCRipple', MDCRipple)
  },
  methods: {
    showMenu () {
      this.menuVisible = true
      this.transform = 'translateX(0px)'
    },
    hideMenu () {
      this.menuVisible = false
      this.transform = 'translateX(-102%)'
    },
    showMsg (message) {
      this.message = message
      setTimeout(() => {
        this.message = ''
      }, 3000)
    }
  }
}
</script>
