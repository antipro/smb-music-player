<template>
  <div class="folder">
    <ul class="mdc-list mdc-list--two-line">
      <li
        class="mdc-list-item"
        v-if="parentUrlStack.length !== 0"
        @click="rollBack()">
        <span class="mdc-list-item__graphic" role="presentation">
          <i class="material-icons" aria-hidden="true">folder_open</i>
        </span>
        <span class="mdc-list-item__text">
          Parent..
        </span>
      </li>
      <li
        class="mdc-list-item"
        v-for="folder in folderlist"
        :key="folder.nativeURL"
        @click="openFolder(folder.nativeURL)"
        @touchstart="starttouch(folder)"
        @touchmove="endtouch"
        @touchend="endtouch"
        :class="{ 'mdc-list-item--selected': selectedFolder.nativeURL === folder.nativeURL }">
        <span class="mdc-list-item__graphic" role="presentation">
          <i class="material-icons" aria-hidden="true">folder</i>
        </span>
        <span class="mdc-list-item__text">
          {{ folder.name }}
          <span class="mdc-list-item__secondary-text">
            URL: {{ folder.nativeURL }}
          </span>
        </span>
      </li>
    </ul>
    <button
      class="mdc-fab material-icons app-fab--absolute"
      aria-label="Microphone"
      data-mdc-auto-init="MDCRipple"
      v-show="selectedFolder.nativeURL"
      @click="selectFolder">
      <span class="mdc-fab__icon">done</span>
    </button>
    <confirm ref="confirmdlg" :title="confirmTitle" @confirm="confirmed"></confirm>
    <prompt ref="promptdlg" :title="promptTitle" @prompt="prompted"></prompt>
  </div>
</template>

<style>
.folder .app-fab--absolute {
  position: fixed;
  bottom: 100px;
  right: 1rem;
}

@media(min-width: 1024px) {
   .folder .app-fab--absolute {
    bottom: 150px;
    right: 1.5rem;
  }
}
</style>

<script>
import { db } from '../database'
import { resolveFileEntry } from '../utils'
import Confirm from '@/components/Confirm'
import Prompt from '@/components/Prompt'

const TOUCHDURATION = 500
var timer = 0
export default {
  name: 'folder',
  data () {
    return {
      currentUrl: '',
      parentUrlStack: [],
      folderlist: [],
      selectedFolder: {},
      confirmTitle: '',
      promptTitle: ''
    }
  },
  created () {
    this.$parent.title = 'Local Folder'
    if (!cordova) {
      return
    }
    resolveFileEntry(cordova.file.externalRootDirectory).then(dirEntry => {
      let dirReader = dirEntry.createReader()
      let readEntries = () => {
        dirReader.readEntries((results) => {
          if (results.length) {
            this.folderlist = this.folderlist.concat(results.filter(entry => entry.isDirectory))
            readEntries()
          } else {
            this.currentUrl = cordova.file.externalRootDirectory
          }
        }, error => console.error(error))
      }
      readEntries()
    }).catch(console.error)
  },
  mounted () {
    document.addEventListener('backbutton', this.confirm, false)
  },
  beforeDestroy () {
    document.removeEventListener('backbutton', this.confirm, false)
  },
  methods: {
    confirm (evt) {
      this.showConfirm()
    },
    openFolder (url) {
      this.selectedFolder = {}
      this.parentUrlStack.push(this.currentUrl)
      window.resolveLocalFileSystemURL(url, (dirEntry) => {
        this.folderlist = []
        let dirReader = dirEntry.createReader()
        let readEntries = () => {
          dirReader.readEntries((results) => {
            if (results.length) {
              this.folderlist = this.folderlist.concat(results.filter(entry => entry.isDirectory))
              readEntries()
            } else {
              this.currentUrl = url
            }
          }, error => console.error(error))
        }
        readEntries()
      })
    },
    rollBack () {
      if (this.parentUrlStack.length === 0) {
        return
      }
      this.selectedDirectory = {}
      let oldUrl = this.currentUrl
      this.currentUrl = this.parentUrlStack.pop()
      window.resolveLocalFileSystemURL(this.currentUrl, (dirEntry) => {
        this.folderlist = []
        let dirReader = dirEntry.createReader()
        let readEntries = () => {
          dirReader.readEntries((results) => {
            if (results.length) {
              this.folderlist = this.folderlist.concat(results.filter(entry => entry.isDirectory))
              readEntries()
            } else {
              document.querySelector('.main').scrollTop = 0
            }
          }, error => {
            console.error(error)
            this.$parent.showMsg('Folder Error')
            this.parentUrlStack.push(this.currentUrl)
            this.currentUrl = oldUrl
          })
        }
        readEntries()
      })
    },
    starttouch (folder) {
      timer = setTimeout(this.longtouch, TOUCHDURATION, folder)
    },
    endtouch () {
      if (timer) {
        clearTimeout(timer)
      }
    },
    longtouch (folder) {
      this.selectedFolder = folder
    },
    showConfirm () {
      this.confirmTitle = 'Exit without save?'
    },
    confirmed (bool) {
      this.confirmTitle = ''
      if (bool) {
        history.back()
      }
    },
    selectFolder () {
      if (!this.selectedFolder.nativeURL) {
        return
      }
      this.promptTitle = 'Name for folder'
    },
    prompted (val) {
      this.promptTitle = ''
      if (!val) {
        return
      }
      let directory = {
        name: val,
        url: this.selectedFolder.nativeURL,
        files: 0,
        type: 1,
        lastupdate: null
      }
      db.directories.add(directory).then((id) => {
        directory.id = id
        this.$root.directorylist.push(directory)
        this.$root.checkDir(directory)
      })
      history.back()
    }
  },
  components: {
    Prompt, Confirm
  }
}
</script>
