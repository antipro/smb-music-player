<template>
  <div id="app">
    <header class="header">
      <button role="tab" class="header__menu js-toggle-menu">
        Toggle nav menu
      </button>

      <h1 class="header__title">Nas Music Player</h1>
    </header>
    <main class="main js-global-main" aria-role="main">
      <router-view/>
    </main>

    <aside class="toast-view js-toast-view">Message</aside>

    <!-- Loading Dialog For use by Activities -->
    <div class="loader js-global-loader is-hidden">
      <svg viewBox="0 0 32 32" width="32" height="32">
        <circle id="spinner" cx="16" cy="16" r="14" fill="none"></circle>
      </svg>
    </div>

    <section class="side-nav js-side-nav">
      <div class="side-nav__content js-side-nav-content">
        <div class="side-nav__header">
          <h1 class="side-nav__title">Nas Music Player</h1>
        </div>

        <div class="side-nav__body">
          <a role="tab" tabindex="0" class="side-nav__blog-post" href="#">Index</a>
          <a role="tab" tabindex="0" class="side-nav__blog-post" href="#">URL 1</a>
          <a role="tab" tabindex="0" class="side-nav__blog-post" href="http://html5test.com/">URL 2</a>
        </div>

        <div class="side-nav__version">Version @VERSION@</div>
      </div>
    </section>

    <aside class="toast-view js-toast-view">Message</aside>
  </div>
</template>
<style src="./assets/appshell.css"></style>
<script>
const $ = (selector) => {
  return document.querySelector(selector)
}

export default {
  name: 'App',
  mounted () {
    $('.js-toggle-menu').addEventListener('click', function (evt) {
      $('.js-side-nav').classList.add('side-nav--visible')
      $('.js-side-nav-content').style['-webkit-transform'] = 'translateX(0px)'
    })
    $('.js-side-nav').addEventListener('click', function (evt) {
      $('.js-side-nav').classList.remove('side-nav--visible')
      $('.js-side-nav-content').style['-webkit-transform'] = 'translateX(-102%)'
    })
  }
}
</script>
