// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './backports'
import { db, randomKeylist } from './database'
import Vue from 'vue'
import VuePersist from 'vue-persist'
import App from './App'
import router from './router'
import * as utils from './utils'

Vue.use(VuePersist, {
  name: 'persist:smbmusic'
})
Vue.config.productionTip = false

/**
 * Socket object collection
 * user.id:array[socket]
 */
const promiseStore = {}

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
    currentFile: {},
    msgbus: new Vue(),
    filelist: [],
    mediaStatus: null,
    online: false,
    ssid: '',
    app: null,
    cachelimit: 30,
    searchlimit: 30,
    playmode: 0,
    manual: true,
    phrase: ''
  },
  persist: [ 'cachelimit', 'searchlimit', 'playmode', 'phrase' ],
  mounted () {
    document.addEventListener('deviceready', () => {
      window.StatusBar.backgroundColorByHexString('#ff6659')
      this.checkOnline()
      cordova.plugins.WifiManager.onnetworkstatechanged = (data) => {
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
    if (!cordova) {
      this.refreshAll(true)
    }
  },
  methods: {
    checkOnline () {
      cordova.plugins.WifiManager.getConnectionInfo((err, wifiInfo) => {
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
          if (directory.type === 1 || directory.type === 0) {
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
      if (directory.type === 1) {
        Vue.set(directory, 'reachable', true)
        if (directory.lastupdate === null) {
          return this.updateFolder(directory)
        }
        return Promise.resolve()
      }
      if (!window.cifs) {
        return Promise.reject(new Error('window.cifs undefined'))
      }
      return new Promise((resolve, reject) => {
        window.cifs.exist(directory.url, bool => {
          resolve(bool)
        }, reject)
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
            let filelist = resp.files.filter(file => file.name.match(/(mp3|m4a|flac|wav|mp4)$/i))
            db.files.bulkPut(filelist.map(file => {
              return {
                name: file.name,
                url: file.url,
                length: file.length,
                fid: directory.id,
                type: directory.type
              }
            }))
            directory.files += filelist.length
          }, reject)
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
      }).catch(error => {
        console.error(error)
        this.$refs.app.showMsg(error)
      }).finally(() => {
        Vue.delete(directory, 'inprogress')
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
      }).catch(error => {
        console.error(error)
        this.$refs.app.showMsg('Error')
      }).finally(() => {
        Vue.delete(directory, 'inprogress')
      })
    },
    updateFolder (directory) {
      Vue.set(directory, 'inprogress', true)
      utils.resolveFileEntry(directory.url).then(dirEntry => {
        return utils.getLocalFiles(dirEntry)
      }).then(entrylist => {
        return Promise.all(entrylist.filter(entry => {
          return entry.name.match(/(mp3|m4a|flac|wav|mp4)$/i)
        }).map(entry => {
          return new Promise((resolve, reject) => {
            entry.getMetadata(metadata => {
              resolve({
                name: entry.name,
                url: entry.nativeURL,
                length: metadata.size,
                fid: directory.id,
                type: directory.type
              })
            }, reject)
          })
        }))
      }).then(filelist => {
        directory.files = filelist.length
        return db.files.bulkPut(filelist)
      }).then(() => {
        db.directories.put({
          id: directory.id,
          name: directory.name,
          url: directory.url,
          files: directory.files,
          type: directory.type,
          lastupdate: new Date()
        })
      }).catch(error => {
        console.error(error)
        this.$refs.app.showMsg('Error')
      }).finally(() => {
        Vue.set(directory, 'inprogress', false)
      })
    },
    playSmbFile (file) {
      if (!window.cifs) {
        return
      }
      this.manual = true
      this.currentFile = file
      this.load(file).then(url => {
        console.log(url)
        if (this.currentFile.id === file.id) {
          this.play(url)
          this.msgbus.$emit('preload')
        }
      }).catch(error => {
        console.error(error)
        this.$refs.app.showMsg(error)
      })
    },
    playLocalFile (file) {
      this.manual = true
      this.currentFile = file
      this.play(file.url)
      this.msgbus.$emit('preload')
    },
    load (file) {
      if (promiseStore[file.id]) {
        return promiseStore[file.id]
      }
      let promise = utils.resolveURL(cordova.file.dataDirectory, 'file_' + file.id).then(url => {
        if (url) {
          delete promiseStore[file.id]
          return Promise.resolve(url)
        }
        return new Promise((resolve, reject) => {
          window.cifs.download(file.url, (res) => {
            if (res.status === 'downloading') {
              Vue.set(file, 'percent', res.percent)
            }
            if (res.status === 'finished') {
              Vue.delete(file, 'percent')
              console.log('finished', res.filename)
              resolve(res.filename)
            }
          }, reject)
        }).then(filename => {
          console.log('move', filename)
          return (async () => {
            let dirEntry = await utils.resolveFileEntry(cordova.file.dataDirectory)
            let fileEntry = await utils.resolveFileEntry(cordova.file.cacheDirectory + filename)
            return utils.moveFileEntry(fileEntry, dirEntry, 'file_' + file.id)
          })()
        }).then((fileEntry) => {
          Vue.set(file, 'save', true)
          return Promise.resolve(fileEntry.toURL())
        })
      }).catch(console.error).finally(() => {
        delete promiseStore[file.id]
      })
      promiseStore[file.id] = promise
      return promise
    },
    play (url) {
      if (audioPlayer) {
        audioPlayer.stop()
        audioPlayer.release()
      }
      audioPlayer = new Media(url, () => {
        this.msgbus.$emit('toggleplay', false)
        if (this.manual) {
          console.log('manual end')
          return
        }
        console.log('natural end')
        if (this.playmode === 3) { // random
          setTimeout(() => {
            this.msgbus.$emit('random')
          }, 500)
        }
        if (this.playmode === 2) { // playlist loop
          setTimeout(() => {
            this.msgbus.$emit('next')
          }, 500)
        }
        if (this.playmode === 1) { // one loop
          setTimeout(() => {
            audioPlayer.play()
          }, 500)
        }
      }, mediaError => {
        if (mediaError.code === 0) {
          return
        }
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
        case Media.MEDIA_STARTING:
          console.log('starting')
          this.manual = false
          break
        case Media.MEDIA_RUNNING:
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
              this.msgbus.$emit('status', utils.formatTime(position) + '/' + utils.formatTime(duration))
            }, error => {
              console.error(error)
              this.$refs.app.showMsg('Position Error')
            })
          }, 1000)
          break
        case Media.MEDIA_PAUSED:
          console.log('paused')
          this.msgbus.$emit('toggleplay', false)
          break
        case Media.MEDIA_STOPPED:
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
    checkCache () {
      this.filelist.forEach(file => {
        utils.resolveURL(cordova.file.dataDirectory, 'file_' + file.id).then(url => {
          if (url) {
            Vue.set(file, 'save', true)
          } else {
            Vue.delete(file, 'save')
          }
        })
      })
    },
    clearCache () {
      let promiselist = []
      let process = () => {
        Promise.all(promiselist).then(fileEntries => {
          if (fileEntries.length <= this.cachelimit) {
            return
          }
          let deleteCount = fileEntries.length - this.cachelimit
          fileEntries.sort((a, b) => {
            return a.ctime - b.ctime
          })
          while (deleteCount > 0) {
            fileEntries.shift().remove(() => console.log('cache file removed'))
            deleteCount--
          }
          console.log('cache cleared')
        }).catch(console.error)
      }
      utils.resolveFileEntry(cordova.file.dataDirectory).then((dirEntry) => {
        let dirReader = dirEntry.createReader()
        let readEntries = () => {
          dirReader.readEntries((results) => {
            if (!results.length) {
              process()
            } else {
              promiselist = promiselist.concat(results.filter(entry => {
                return entry.isFile && entry.name.startsWith('file_')
              }).map(entry => {
                return new Promise((resolve, reject) => {
                  entry.getMetadata(metadata => {
                    entry.ctime = metadata.modificationTime.getTime()
                    resolve(entry)
                  }, reject)
                })
              }))
              readEntries()
            }
          }, console.error)
        }
        readEntries()
      })
    }
  },
  watch: {
    phrase (val) {
      if (this.phrase === '') {
        this.filelist = []
        return
      }
      if (this.phrase === ':cached') {
        let keylist = []
        let process = () => {
          console.log(keylist)
          db.files.where('id').anyOf(keylist).toArray(filelist => {
            console.log(filelist)
            this.filelist = filelist
            this.checkCache()
          })
        }
        utils.resolveFileEntry(cordova.file.dataDirectory).then(dirEntry => {
          let dirReader = dirEntry.createReader()
          let readEntries = () => {
            dirReader.readEntries((results) => {
              if (!results.length) {
                process()
              } else {
                keylist = keylist.concat(results.filter(entry => {
                  return entry.isFile && entry.name.startsWith('file_')
                }).map(entry => parseInt(entry.name.split('_')[1])))
                readEntries()
              }
            }, console.error)
          }
          readEntries()
        })
        return
      }
      let fidlist = []
      for (const directory of this.directorylist) {
        if (directory.reachable) {
          fidlist.push(directory.id)
        }
      }
      if (fidlist.length === 0) {
        this.filelist = []
        return
      }
      let collection = db.files.where('fid').anyOf(fidlist)
      if (this.phrase === ':random') {
        randomKeylist(collection, this.searchlimit).then(keylist => {
          console.log(keylist)
          db.files.where('id').anyOf(keylist).toArray(filelist => {
            console.log(filelist)
            this.filelist = filelist
            this.checkCache()
          })
        }).catch(console.error)
        return
      }
      let regex = new RegExp(this.phrase, 'i')
      collection.filter(file => regex.test(file.name)).limit(this.searchlimit).toArray(filelist => {
        this.filelist = filelist
        this.checkCache()
      })
    }
  }
})
