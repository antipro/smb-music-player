<template>
  <div class="library">
    <ul class="mdc-list mdc-list--two-line">
      <li
        class="mdc-list-item"
        v-for="directory in directorylist"
        :key="directory.id">
        <span class="mdc-list-item__graphic" role="presentation">
          <i class="material-icons" aria-hidden="true">folder</i>
        </span>
        <span class="mdc-list-item__text">
          {{ directory.name }}
          <span class="mdc-list-item__secondary-text">
            Files: {{ directory.files }}
          </span>
          <span class="mdc-list-item__secondary-text">
            Url: {{ directory.url }}
          </span>
        </span>
        <div class="btn-group">
          <span
            class="mdc-list-item__meta material-icons"
            aria-label="Refresh Directory"
            title="Refresh"
            @click.stop="refresh(directory.id)">
            refresh
          </span>
          <span
            class="mdc-list-item__meta material-icons"
            aria-label="Delete Directory"
            title="Delete"
            @click.stop="remove(directory.id)">
            delete
          </span>
        </div>
        <div
          role="progressbar"
          class="mdc-linear-progress mdc-linear-progress--indeterminate"
          v-if="inprogress.indexOf(directory.id) > -1">
          <div class="mdc-linear-progress__buffering-dots"></div>
          <div class="mdc-linear-progress__buffer"></div>
          <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
            <span class="mdc-linear-progress__bar-inner"></span>
          </div>
          <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
            <span class="mdc-linear-progress__bar-inner"></span>
          </div>
        </div>
      </li>
    </ul>
    <router-link
      class="mdc-fab material-icons app-fab--absolute"
      aria-label="Add"
      :to="{ name: 'auth' }">
      <span class="mdc-fab__icon">add</span>
    </router-link>
  </div>
</template>

<style>
.library .app-fab--absolute {
  position: fixed; bottom: 100px; right: 1rem;
}
@media(min-width: 1024px) {
   .library .app-fab--absolute {
    bottom: 150px; right: 1.5rem;
  }
}
.library .mdc-list-item .mdc-linear-progress {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
}
.library .mdc-list-item .btn-group {
  position: absolute; right: 0; top: 0; font-size: 48px;
}
.library .mdc-list-item .btn-group * {
  font-size: 36px;
}
</style>

<script>
import db from '../database'

export default {
  name: 'library',
  data () {
    return {
      directorylist: [],
      inprogress: []
    }
  },
  created () {
    this.$parent.title = 'Library'
    this.showDirs()
  },
  methods: {
    refresh (id) {
      console.log(id)
    },
    remove (id) {
      db.transaction('rw', db.directories, db.files, async () => {
        db.directories.delete(id)
        db.files.where('fid').equals(id).delete()
      }).then(() => {
        this.$parent.showMsg('Directory deleted')
        this.showDirs()
      }).catch(err => {
        console.log(err)
        this.$parent.showMsg('Error')
      })
    },
    async showDirs () {
      this.directorylist = await db.directories.toArray()
      this.directorylist.forEach(directory => {
        if (directory.lastupdate !== null) {
          return
        }
        this.checkDir(directory)
      })
    },
    checkDir (directory) {
      if (!window.cifs) {
        return
      }
      window.cifs.exist(directory.url, bool => {
        if (bool && directory.lastupdate === null) {
          this.updateDir(directory)
        }
      }, error => {
        console.log(error)
      })
    },
    updateDir (directory) {
      if (!window.cifs) {
        return
      }
      this.inprogress.push(directory.id)
      db.transaction('rw', db.directories, db.files, async () => {
        await db.files.where('fid').equals(directory.id).delete()
        let callback = async (url) => {
          window.cifs.dir(url, files => {
            for (const file of files) {
              if (file.directory && !file.name.endsWith('$/')) {
                callback(file.url)
              }
              if (!file.directory) {
                db.files.put({
                  name: file.name,
                  url: file.url,
                  length: file.length,
                  fid: directory.id
                })
                directory.files++
              }
            }
          }, error => {
            console.log(error)
          })
        }
        await callback(directory.url)
        directory.lastupdate = new Date()
        db.directories.put(directory)
      }).then(() => {
        this.inprogress = this.inprogress.filter(e => {
          return e !== directory.id
        })
        console.log('done')
      }).catch(error => {
        this.inprogress = this.inprogress.filter(e => {
          return e !== directory.id
        })
        console.log(error)
      })
    }
  }
}
</script>
