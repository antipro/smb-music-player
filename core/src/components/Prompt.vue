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
        <div class="mdc-text-field mdc-text-field--fullwidth">
          <input
            type="text"
            class="mdc-text-field__input"
            v-model="value">
          <div class="mdc-text-field__bottom-line"></div>
        </div>
      </section>
      <footer class="mdc-dialog__footer">
        <button
          type="button"
          class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel"
          @click="sayNo">Cancel</button>
        <button
          type="button"
          class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept"
          @click="sayYes">Save</button>
      </footer>
    </div>
    <div class="mdc-dialog__backdrop"></div>
  </aside>
</template>

<script>
export default {
  name: 'prompt',
  data () {
    return {
      value: ''
    }
  },
  props: {
    title: {
      type: String
    }
  },
  methods: {
    sayYes () {
      this.$emit('prompt', this.value)
    },
    sayNo () {
      this.$emit('prompt')
    }
  }
}
</script>
