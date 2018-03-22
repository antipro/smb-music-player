<template>
  <div id='app'>
    <header class='header'>
      <button role='tab' class='header__menu' @click="showMenu">
        Toggle nav menu
      </button>

      <h1 class='header__title'>Nas Music Player</h1>
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
          <h1 class='side-nav__title'>Nas Music Player</h1>
        </div>
        <div class='side-nav__body'>
          <router-link role='tab' tabindex='0' class='side-nav__blog-post' :to="{ name: 'player' }">Player</router-link>
          <router-link role='tab' tabindex='0' class='side-nav__blog-post' :to="{ name: 'library' }">Library</router-link>
          <router-link role='tab' tabindex='0' class='side-nav__blog-post' :to="{ name: 'about' }">About</router-link>
        </div>

      </div>
    </section>

    <aside class='toast-view js-toast-view'>Message</aside>
  </div>
</template>
<style src='./assets/appshell.css'></style>

<style lang="scss">
@import "@material/button/mdc-button";
@import "@material/fab/mdc-fab";
@import "@material/list/mdc-list";

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
      menuVisible: false,
      transform: 'translateX(-102%)'
    }
  },
  mounted () {
    mdcAutoInit.deregister('MDCRipple')
    mdcAutoInit.register('MDCRipple', MDCRipple)
    mdcAutoInit()
  },
  methods: {
    showMenu () {
      this.menuVisible = true
      this.transform = 'translateX(0px)'
    },
    hideMenu () {
      this.menuVisible = false
      this.transform = 'translateX(-102%)'
    }
  }
}
</script>
