<template>
  <div class="directory">
    <ul class="mdc-list mdc-list--two-line">
      <li
        class="mdc-list-item"
        data-mdc-auto-init="MDCRipple"
        v-if="parentUrlStack.length !== 0"
        @click="rollBack()">
        <span class="mdc-list-item__graphic" role="presentation">
          <i class="material-icons" aria-hidden="true">folder</i>
        </span>
        <span class="mdc-list-item__text">
          ..
        </span>
      </li>
      <li
        class="mdc-list-item"
        data-mdc-auto-init="MDCRipple"
        v-for="directory in directorylist"
        :key="directory.url"
        @click="openDir(directory.url)"
        @touchstart="starttouch(directory)"
        @touchmove="endtouch"
        @touchend="endtouch"
        :class="{ 'mdc-list-item--selected': selectedDirectory.url === directory.url }">
        <span class="mdc-list-item__graphic" role="presentation">
          <i class="material-icons" aria-hidden="true">folder</i>
        </span>
        <span class="mdc-list-item__text">
          {{ directory.name }}
          <span class="mdc-list-item__secondary-text">
            URL: {{ directory.url }}
          </span>
        </span>
      </li>
    </ul>
    <button
      class="mdc-fab material-icons app-fab--absolute"
      aria-label="Microphone"
      data-mdc-auto-init="MDCRipple"
      v-show="selectedDirectory.url"
      @click="selectDir">
      <span class="mdc-fab__icon">done</span>
    </button>
  </div>
</template>

<style>
.directory .app-fab--absolute {
  position: fixed;
  bottom: 100px;
  right: 1rem;
}

@media(min-width: 1024px) {
   .directory .app-fab--absolute {
    bottom: 150px;
    right: 1.5rem;
  }
}
</style>

<script>
import mdcAutoInit from '@material/auto-init'

const TOUCHDURATION = 500
var timer = 0
export default {
  name: 'directroy',
  data () {
    return {
      currentUrl: '',
      parentUrlStack: [],
      directorylist: [],
      selectedDirectory: {}
    }
  },
  created () {
    this.$parent.title = 'Directory'
    if (!this.$route.params.url) {
      this.$router.go(-1)
    }
    if (window.cifs) {
      window.cifs.dir(this.$route.params.url, (files) => {
        this.directorylist = files.filter(file => {
          return file.directory && !file.name.endsWith('$/')
        })
        this.currentUrl = this.$route.params.url
        alert(files)
      }, function (err) {
        alert(err)
      })
    } else {
      this.directorylist = [ {
        name: 'Youtube',
        url: 'smb://192.168.0.144/Music/Youtube/',
        directory: true
      }, {
        name: 'CloudMusic',
        url: 'smb://192.168.0.144/Music/CloudMusic/',
        directory: true
      } ]
    }
  },
  updated () {
    mdcAutoInit()
  },
  methods: {
    openDir (url) {
      this.selectedDirectory = {}
      this.parentUrlStack.push(this.currentUrl)
      window.cifs.dir(url, (files) => {
        this.directorylist = files.filter(file => {
          return file.directory && !file.name.endsWith('$/')
        })
        this.currentUrl = url
      }, function (err) {
        alert(err)
      })
    },
    rollBack () {
      if (this.parentUrlStack.length === 0) {
        return
      }
      this.selectedDirectory = {}
      this.currentUrl = this.parentUrlStack.pop()
      window.cifs.dir(this.currentUrl, (files) => {
        this.directorylist = files.filter(file => {
          return file.directory && !file.name.endsWith('$/')
        })
      }, function (err) {
        alert(err)
      })
    },
    starttouch (directory) {
      timer = setTimeout(this.longtouch, TOUCHDURATION, directory)
    },
    endtouch () {
      if (timer) {
        clearTimeout(timer)
      }
    },
    longtouch (directory) {
      this.selectedDirectory = directory
    },
    selectDir () {
      if (!this.selectedDirectory.url) {
        return
      }
      alert('select')
    }
  }
}
</script>
