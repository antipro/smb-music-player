<template>
  <aside
    class="mdc-dialog"
    role="alertdialog"
    :class="{ 'mdc-dialog--open': title }">
    <div class="mdc-dialog__surface">
      <header class="mdc-dialog__header">
        <h2 class="mdc-dialog__header__title">
          {{ title }}
        </h2>
      </header>
      <section class="mdc-dialog__body">
        {{ description }}
      </section>
      <footer class="mdc-dialog__footer">
        <button
          type="button"
          class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel"
          @click="sayNo">No</button>
        <button
          type="button"
          class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept"
          @click="sayYes">Yes</button>
      </footer>
    </div>
    <div class="mdc-dialog__backdrop"></div>
  </aside>
</template>

<script>
export default {
  name: 'confirm',
  props: {
    title: {
      type: String
    },
    description: {
      type: String
    }
  },
  methods: {
    sayYes () {
      this.$emit('confirm', true)
    },
    sayNo () {
      this.$emit('confirm', false)
    }
  }
}
</script>
