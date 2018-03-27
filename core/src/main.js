// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './backports'
import db from './database'
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  data: {
    directorylist: []
  },
  created () {
    this.refreshAll()
  },
  methods: {
    refreshAll () {
      db.directories.toArray((directorylist) => {
        this.directorylist = directorylist
        this.directorylist.forEach(directory => {
          if (directory.lastupdate !== null) {
            return
          }
          this.checkDir(directory)
        })
      })
    },
    refresh (directory) {
      this.updateDir(directory)
    },
    remove (directory) {
      Vue.set(directory, 'inprogress', true)
      db.transaction('rw', db.directories, db.files, async () => {
        db.directories.delete(directory.id)
        db.files.where('fid').equals(directory.id).delete()
      }).then(() => {
        this.directorylist = this.directorylist.filter(d => {
          return d.id !== directory.id
        })
        Vue.delete(directory, 'inprogress')
      }).catch(err => {
        Vue.delete(directory, 'inprogress')
        console.log(err)
        // this.$parent.showMsg('Error')
      })
    },
    checkDir (directory) {
      if (!window.cifs) {
        return
      }
      console.log('checkDir')
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
      db.transaction('rw', db.directories, db.files, async () => {
        Vue.set(directory, 'inprogress', true)
        await db.files.where('fid').equals(directory.id).delete()
        directory.files = 0
        window.cifs.getfiles(directory.url, resp => {
          if (resp.status === 'processing') {
            let fileCount = 0
            for (const file of resp.files) {
              if (!file.name.match(/(mp3|m4a|flac|wav|mp4)$/i)) {
                continue
              }
              db.files.put({
                name: file.name,
                url: file.url,
                length: file.length,
                fid: directory.id
              })
              fileCount++
            }
            directory.files += fileCount
          } else if (resp.status === 'finished') {
            Vue.delete(directory, 'inprogress')
            directory.lastupdate = new Date()
            db.directories.put(directory)
          }
        }, error => {
          Vue.delete(directory, 'inprogress')
          console.log(error)
        })
      }).catch(error => {
        Vue.delete(directory, 'inprogress')
        console.log(error)
      })
    }
  }
})
