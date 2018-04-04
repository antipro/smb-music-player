// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './backports'
import db from './database'
import Vue from 'vue'
import VuePersist from 'vue-persist'
import App from './App'
import router from './router'
import { formatTime, resolveFileEntry, moveFileEntry, resolveURL } from './utils'

Vue.use(VuePersist, {
  name: 'persist:smbmusic'
})
Vue.config.productionTip = false

var mediaTimer = 0
var audioPlayer = null
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App ref="app"/>',
  data: {
    directorylist: [],
    currentFile: null,
    msgbus: new Vue(),
    mediaStatus: null,
    online: false,
    ssid: '',
    app: null,
    cachelimit: 3,
    loopmode: 0
  },
  persist: [ 'cachelimit', 'loopmode' ],
  mounted () {
    document.addEventListener('deviceready', () => {
      this.checkOnline()
      document.addEventListener('backbutton', evt => {
        if (location.href.indexOf('directory') > -1) {
          this.$refs.app.showConfirm()
        } else if (location.href.endsWith('#/')) {
          navigator.Backbutton.goHome(() => {
            this.clearCache()
          }, () => {
            console.log('go home fail')
          })
        } else {
          history.back()
        }
      }, false)
      window.cordova.plugins.WifiManager.onnetworkstatechanged = (data) => {
        if (data.BSSID !== null && data.networkInfo.state === 'CONNECTED' && data.wifiInfo !== null) {
          // console.log(data)
          // alert('connected ' + data.networkInfo.type)
          this.checkOnline()
        }
        if (data.BSSID === null && data.networkInfo.state === 'DISCONNECTED' && data.wifiInfo === null) {
          // console.log(data)
          // alert('disconnected ' + navigator.connection.type)
          if (this.online === true) {
            this.online = false
            this.ssid = ''
            this.refreshAll(false)
          } else {
            console.log('already offline')
          }
        }
      }
    }, false)
    if (!window.cordova) {
      this.refreshAll(true)
    }
  },
  methods: {
    checkOnline () {
      window.cordova.plugins.WifiManager.getConnectionInfo((err, wifiInfo) => {
        if (err) {
          console.error(err)
          return
        }
        console.log(wifiInfo)
        if (!wifiInfo.BSSID) {
          console.log('No wifi')
          this.ssid = ''
          this.online = false
          this.refreshAll(false)
          return
        }
        this.online = true
        if (this.ssid !== wifiInfo.SSID) {
          this.ssid = wifiInfo.SSID
          this.refreshAll(true)
        }
      })
    },
    refreshAll (bool) {
      db.directories.toArray().then(directorylist => {
        this.directorylist = directorylist
        return Promise.all(this.directorylist.map(directory => {
          Vue.delete(directory, 'inprogress')
          if (directory.type === 0) {
            Vue.set(directory, 'reachable', true)
            return Promise.resolve()
          }
          if (bool) {
            return this.checkDir(directory)
          } else {
            Vue.set(directory, 'reachable', false)
            return Promise.resolve()
          }
        }))
      }).then(() => {
        console.log('RefreshAll Finished')
        this.msgbus.$emit('reset')
      }).catch(error => {
        console.log('RefreshAll Interrupted', error)
      })
    },
    checkDir (directory) {
      if (!window.cifs) {
        return Promise.reject(new Error('window.cifs undefined'))
      }
      return new Promise((resolve, reject) => {
        window.cifs.exist(directory.url, bool => {
          resolve(bool)
        }, error => {
          reject(error)
        })
      }).then(bool => {
        if (!bool) {
          Vue.set(directory, 'reachable', false)
          return Promise.resolve()
        }
        Vue.set(directory, 'reachable', true)
        if (directory.lastupdate === null) {
          return this.updateDir(directory)
        }
        return Promise.resolve()
      }).catch(error => {
        console.error(error)
        Vue.set(directory, 'reachable', false)
      })
    },
    updateDir (directory) {
      if (!window.cifs) {
        return Promise.reject(new Error('window.cifs undefined'))
      }
      Vue.set(directory, 'inprogress', true)
      return db.files.where('fid').equals(directory.id).delete().then(() => {
        return new Promise((resolve, reject) => {
          directory.files = 0
          window.cifs.getfiles(directory.url, resp => {
            if (resp.status === 'finished') {
              resolve()
              return
            }
            let fileCount = 0
            for (const file of resp.files) {
              if (!file.name.match(/(mp3|m4a|flac|wav|mp4)$/i)) {
                continue
              }
              db.files.put({
                name: file.name,
                url: file.url,
                length: file.length,
                fid: directory.id,
                type: directory.type
              })
              fileCount++
            }
            directory.files += fileCount
          }, error => {
            reject(error)
          })
        })
      }).then(() => {
        db.directories.put({
          id: directory.id,
          name: directory.name,
          url: directory.url,
          files: directory.files,
          type: directory.type,
          lastupdate: new Date()
        })
        Vue.delete(directory, 'inprogress')
      }).catch(error => {
        console.error(error)
        Vue.delete(directory, 'inprogress')
        this.$refs.app.showMsg(error)
      })
    },
    removeDir (directory) {
      Vue.set(directory, 'inprogress', true)
      db.directories.delete(directory.id).then(() => {
        return db.files.where('fid').equals(directory.id).delete()
      }).then(() => {
        this.directorylist = this.directorylist.filter(d => {
          return d.id !== directory.id
        })
        Vue.delete(directory, 'inprogress')
      }).catch(error => {
        Vue.delete(directory, 'inprogress')
        console.error(error)
        this.$refs.app.showMsg('Error')
      })
    },
    playSmbFile (file) {
      if (!window.cifs) {
        return
      }
      if (audioPlayer) {
        audioPlayer.stop()
        audioPlayer.release()
      }
      this.currentFile = file
      this.msgbus.$emit('position', file)
      audioPlayer = null
      resolveURL(window.cordova.file.dataDirectory, 'file_' + file.id).then(url => {
        if (url) {
          this.play(url)
          return
        }
        window.cifs.download(file.url, (res) => {
          if (res.status === 'downloading' && this.currentFile.url === file.url) {
            this.msgbus.$emit('status', `Buffering(${res.percent})...`)
          }
          if (res.status === 'finished') {
            (async () => {
              let dirEntry = await resolveFileEntry(window.cordova.file.dataDirectory)
              let fileEntry = await resolveFileEntry(window.cordova.file.cacheDirectory + res.filename)
              return moveFileEntry(fileEntry, dirEntry, 'file_' + file.id)
            })().then((fileEntry) => {
              if (this.currentFile.url !== file.url) {
                return
              }
              this.play(fileEntry.toURL())
            }).catch(error => console.error(error))
          }
        }, (error) => {
          this.currentFile = null
          console.error(error)
          this.$refs.app.showMsg('Download Error')
        })
      }).catch(console.error)
    },
    play (url) {
      audioPlayer = new window.Media(url, () => {
        this.msgbus.$emit('toggleplay', false)
      }, mediaError => {
        console.error(mediaError)
        this.$refs.app.showMsg('Play Error')
      }, mediaStatus => {
        this.changeStatus(mediaStatus)
      })
      audioPlayer.play()
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
      this.msgbus.$emit('previous')
    },
    next () {
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
              this.$refs.app.showMsg('Position Error')
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
    },
    clearCache () {
      let fileEntries = []
      let process = () => {
        if (fileEntries.length <= this.cachelimit) {
          return
        }
        let deleteCount = fileEntries.length - this.cachelimit
        while (deleteCount > 0) {
          fileEntries.shift().remove(() => console.log('cache file removed'))
          deleteCount--
        }
      }
      resolveFileEntry(window.cordova.file.dataDirectory).then((dirEntry) => {
        let dirReader = dirEntry.createReader()
        let readEntries = () => {
          dirReader.readEntries((results) => {
            if (!results.length) {
              process()
            } else {
              fileEntries = fileEntries.concat(results.filter(entry => entry.isFile && entry.name.startsWith('file_')))
              readEntries()
            }
          }, error => console.error(error))
        }
        readEntries()
      })
    }
  }
})
