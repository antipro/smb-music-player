// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './backports'
import db from './database'
import Vue from 'vue'
import App from './App'
import router from './router'
import { formatTime } from './utils'

Vue.config.productionTip = false

var mediaTimer = 0
var audioPlayer = null
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  data: {
    directorylist: [],
    currentFile: null,
    msgbus: new Vue(),
    mediaStatus: null
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
    },
    play (file) {
      if (!window.cifs) {
        return
      }
      if (audioPlayer) {
        audioPlayer.stop()
        audioPlayer.release()
      }
      this.currentFile = file
      this.msgbus.$emit('position', file)
      window.cifs.download(file.url, (res) => {
        if (this.currentFile.url !== file.url) {
          return
        }
        if (res.status === 'downloading') {
          this.msgbus.$emit('status', `Buffering(${res.percent})...`)
        }
        if (res.status === 'finished') {
          audioPlayer = new window.Media(window.cordova.file.cacheDirectory + res.filename, () => {
            this.msgbus.$emit('toggleplay', false)
          }, mediaError => {
            console.log(JSON.stringify(mediaError))
          }, mediaStatus => {
            this.changeStatus(mediaStatus)
          })
          audioPlayer.play()
        }
      }, (error) => {
        this.currentFile = null
        console.log(error)
      })
    },
    resume () {
      if (!audioPlayer) {
        return
      }
      audioPlayer.play()
    },
    pause () {
      if (!audioPlayer) {
        return
      }
      audioPlayer.pause()
    },
    seekTo (percent) {
      if (!audioPlayer) {
        return
      }
      let duration = audioPlayer.getDuration()
      if (duration === -1) {
        return
      }
      audioPlayer.seekTo(duration * 1000 * percent)
    },
    previous () {
      if (!audioPlayer) {
        return
      }
      this.msgbus.$emit('previous')
    },
    next () {
      if (!audioPlayer) {
        return
      }
      this.msgbus.$emit('next')
    },
    changeStatus (mediaStatus) {
      this.mediaStatus = mediaStatus
      switch (mediaStatus) {
        case window.Media.MEDIA_STARTING:
          console.log('starting')
          break
        case window.Media.MEDIA_RUNNING:
          console.log('running')
          this.msgbus.$emit('toggleplay', true)
          mediaTimer = setInterval(() => {
            audioPlayer.getCurrentPosition(position => {
              let duration = audioPlayer.getDuration()
              if (duration < 0) {
                return
              }
              let percent = position / duration
              if (percent < 0) {
                return
              }
              this.msgbus.$emit('progress', `scaleX(${percent})`)
              this.msgbus.$emit('status', formatTime(position) + '/' + formatTime(duration))
            }, error => {
              console.log(error)
            })
          }, 1000)
          break
        case window.Media.MEDIA_PAUSED:
          console.log('paused')
          this.msgbus.$emit('toggleplay', false)
          break
        case window.Media.MEDIA_STOPPED:
          clearInterval(mediaTimer)
          this.msgbus.$emit('progress', `scaleX(0)`)
          this.msgbus.$emit('status', '')
          this.msgbus.$emit('toggleplay', false)
          console.log('stopped')
          break
        default:
          console.log('None')
      }
    }
  }
})
