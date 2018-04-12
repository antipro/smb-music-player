<template>
  <aside
    class="record mdc-dialog"
    role="alertdialog"
    :class="{ 'mdc-dialog--open': $parent.listening }">
    <div class="mdc-dialog__surface">
      <header class="mdc-dialog__header">
        <h2 class="mdc-dialog__header__title">
          Record
        </h2>
      </header>
      <section class="mdc-dialog__body">
        <div v-if="parsing">
          <p v-show="candidates.length === 0">Parsing...</p>
          <ul class="mdc-list mdc-list--dense">
            <li
              class="mdc-list-item"
              v-for="candidate in candidates"
              :key="candidate"
              @click="chooseResult(candidate)">{{ format(candidate) }}</li>
          </ul>
        </div>
        <div v-else class="sound-wrapper">
          <canvas id="sound" class="sound"></canvas>
          <h3 class="countdown">{{ parseInt(countdown) }}</h3>
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
          v-if="!parsing"
          @click="sayYes">Confirm</button>
      </footer>
    </div>
    <div class="mdc-dialog__backdrop"></div>
  </aside>
</template>

<style>
.record .sound { margin: 0 auto; }
.record .countdown { text-align: center; }
</style>

<script>
import axios from 'axios'
import { resolveFileEntry } from '../utils'

const RANGE = 30
const MIN = 70
var radius = 0
var canvas = null
var centre = {
  x: null,
  y: null
}
var ctx = null
var audioRecorder = null
let mediaTimer = 0
export default {
  name: 'record',
  data () {
    return {
      recording: false,
      cancel: false,
      parsing: false,
      countdown: 10,
      msgbus: null,
      candidates: []
    }
  },
  created () {
    this.msgbus = this.$root.msgbus
  },
  mounted () {
    canvas = document.querySelector('#sound')
    canvas.width = document.querySelector('.sound-wrapper').clientWidth
    canvas.height = 200
    ctx = canvas.getContext('2d')
    centre.x = canvas.width / 2
    centre.y = canvas.height / 2
  },
  methods: {
    startRecord () {
      this.candidates = []
      this.countdown = 10
      if (audioRecorder) {
        audioRecorder.stopRecord()
        audioRecorder.release()
      }
      audioRecorder = new window.Media(window.cordova.file.cacheDirectory + 'speech.amr', () => {
        console.log('record done')
        if (this.cancel) {
          return
        }
        this.processFile()
      }, mediaError => {
        console.error(mediaError)
      }, mediaStatus => {
        this.changeStatus(mediaStatus)
      })
      audioRecorder.startRecord()
      this.cancel = false
      this.parsing = false
    },
    sayYes () {
      if (audioRecorder) {
        audioRecorder.stopRecord()
        audioRecorder.release()
      }
    },
    processFile () {
      this.parsing = true
      resolveFileEntry(window.cordova.file.cacheDirectory + 'speech.amr').then(fileEntry => {
        return new Promise((resolve, reject) => {
          fileEntry.file(resolve, reject)
        })
      }).then(file => {
        return new Promise((resolve, reject) => {
          let reader = new FileReader()
          reader.onerror = reject
          reader.onloadend = () => {
            resolve(reader.result)
          }
          reader.readAsArrayBuffer(file)
        })
      }).then(result => {
        return (async () => {
          let response = await axios({
            method: 'get',
            url: 'https://functional-center.herokuapp.com/smb_music/baidu_speechtoken'
          })
          if (response.status !== 200) {
            return { err_no: response.status, err_msg: response.statusText }
          }
          let accessToken = response.data.token
          let lan = 'en'
          let cuid = 'smb-music'
          response = await axios({
            method: 'post',
            url: 'http://vop.baidu.com/server_api?lan=' + lan + '&cuid=' + cuid + '&token=' + accessToken,
            headers: {
              'Content-Type': 'audio/amr; rate=8000'
            },
            data: result
          })
          if (response.status !== 200) {
            return { err_no: response.status, err_msg: response.statusText }
          }
          return response.data
        })()
      }).then(res => {
        if (res.err_no !== 0) {
          this.$parent.$parent.showMsg(res.err_msg)
          return
        }
        if (res.result.length === 1) {
          this.chooseResult(res.result[0])
        } else {
          this.candidates = res.result
        }
      })
    },
    sayNo () {
      this.cancel = true
      if (audioRecorder) {
        audioRecorder.stopRecord()
        audioRecorder.release()
      }
      this.$parent.listening = false
    },
    changeStatus (mediaStatus) {
      switch (mediaStatus) {
        case window.Media.MEDIA_STARTING:
          console.log('starting')
          break
        case window.Media.MEDIA_RUNNING:
          console.log('running')
          mediaTimer = setInterval(() => {
            this.countdown -= 0.5
            if (this.countdown < 1) {
              this.sayYes()
              return
            }
            audioRecorder.getCurrentAmplitude(amp => {
              this.showWave(amp)
            }, error => {
              console.log('Error getting amp=' + error)
            })
          }, 500)
          break
        case window.Media.MEDIA_PAUSED:
          console.log('paused')
          break
        case window.Media.MEDIA_STOPPED:
          clearInterval(mediaTimer)
          console.log('stopped')
          break
        default:
          console.log('None')
      }
    },
    showWave (amp) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      radius = MIN + amp * RANGE
      console.log(amp, radius)
      ctx.beginPath()
      ctx.arc(centre.x, centre.y, radius, 0, 2 * Math.PI)
      var grd = ctx.createRadialGradient(centre.x, centre.y, 0, centre.x, centre.y, radius)
      grd.addColorStop(0, 'red')
      grd.addColorStop(1, 'white')
      ctx.fillStyle = grd
      ctx.fill()
    },
    chooseResult (phrase) {
      this.msgbus.$emit('search', this.format(phrase))
      this.$parent.listening = false
    },
    format (candidate) {
      return candidate.substr(0, candidate.length - 1)
    }
  }
}
</script>
