<template>
  <div class="auth">
    <div class="mdc-text-field mdc-text-field--box mdc-text-field--with-leading-icon">
      <i class="material-icons mdc-text-field__icon">storage</i>
      <input
        type="text"
        id="search-input"
        class="mdc-text-field__input"
        required
        v-model="serverAddress"
        @focus="serverAddressFocused = true"
        @blur="serverAddressFocused = false">
      <label
        for="search-input"
        class="mdc-floating-label"
        :class="{ 'mdc-floating-label--float-above': serverAddressFloated }">Server Address</label>
      <div class="mdc-text-field__bottom-line"></div>
    </div>
    <p id="my-text-field-helper-text" class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent" style="display: block;" aria-hidden="true">
      eg: 192.168.0.2/Public
    </p>
    <div class="mdc-text-field mdc-text-field--box mdc-text-field--with-leading-icon" :class="{ 'mdc-text-field--disabled': guest }">
      <i class="material-icons mdc-text-field__icon">account_box</i>
      <input
        type="text"
        id="search-input"
        class="mdc-text-field__input"
        v-model="userName"
        @focus="userNameFocused = true"
        @blur="userNameFocused = false">
      <label
        for="search-input"
        class="mdc-floating-label"
        :class="{ 'mdc-floating-label--float-above': userNameFloated }">User Name</label>
      <div class="mdc-text-field__bottom-line"></div>
    </div>
    <div class="mdc-text-field mdc-text-field--box mdc-text-field--with-leading-icon" :class="{ 'mdc-text-field--disabled': guest }">
      <i class="material-icons mdc-text-field__icon">vpn_key</i>
      <input
        type="text"
        id="search-input"
        class="mdc-text-field__input"
        v-model="password"
        @focus="passwordFocused = true"
        @blur="passwordFocused = false">
      <label
        for="search-input"
        class="mdc-floating-label"
        :class="{ 'mdc-floating-label--float-above': passwordFloated }">Password</label>
      <div class="mdc-text-field__bottom-line"></div>
    </div>
    <div class="mdc-form-field">
      <div class="mdc-checkbox">
        <input
          type="checkbox"
          id="anonymous_chkbox"
          class="mdc-checkbox__native-control"
          v-model="guest"/>
        <div class="mdc-checkbox__background">
          <svg class="mdc-checkbox__checkmark"
            viewBox="0 0 24 24">
            <path class="mdc-checkbox__checkmark-path"
              fill="none"
              stroke="white"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
          </svg>
          <div class="mdc-checkbox__mixedmark"></div>
        </div>
      </div>
      <label for="anonymous_chkbox">Anonymous</label>
    </div>
    <div class="action">
      <button class="mdc-button mdc-button--raised" @click="accept" :disabled="!validated">
        Accept
      </button>
    </div>
  </div>
</template>

<style>
.auth .mdc-text-field {
  display: block;
  margin-top: 0;
}
.auth .action {
  text-align: center;
}
</style>

<script>
export default {
  name: 'auth',
  data () {
    return {
      serverAddress: '',
      serverAddressFocused: false,
      userName: '',
      userNameFocused: false,
      password: '',
      passwordFocused: false,
      guest: false
    }
  },
  created () {
    this.$parent.title = 'Auth'
  },
  methods: {
    accept () {
      console.log('accept')
      if (!this.serverAddress.endsWith('/')) {
        this.serverAddress += '/'
      }
      let url = ''
      if (this.guest) {
        url = 'smb://' + this.serverAddress
      } else {
        url = 'smb://' + this.userName + ':' + this.password + '@' + this.serverAddress
      }
      this.$router.replace({
        name: 'directory',
        params: {
          url
        }
      })
    }
  },
  computed: {
    serverAddressFloated () {
      return this.serverAddress !== '' || this.serverAddressFocused
    },
    userNameFloated () {
      return this.userName !== '' || this.userNameFocused
    },
    passwordFloated () {
      return this.password !== '' || this.passwordFocused
    },
    validated () {
      if (this.serverAddress === '') {
        return false
      }
      if (this.guest === false && (this.userName === '' || this.password === '')) {
        return false
      }
      return true
    }
  }
}
</script>
