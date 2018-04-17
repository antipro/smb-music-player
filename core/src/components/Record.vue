<template>
  <aside
    class="record mdc-dialog"
    role="alertdialog"
    :class="{ 'mdc-dialog--open': $parent.listening }">
    <div class="mdc-dialog__surface">
      <header class="mdc-dialog__header">
        <h2 class="mdc-dialog__header__title">
          Speak
        </h2>
      </header>
      <section class="mdc-dialog__body">
        <div v-show="parsing === true">
          <h3 class="record-message" v-show="candidates.length === 0">Parsing...</h3>
          <div v-show="candidates.length === 0" role="progressbar" class="mdc-linear-progress mdc-linear-progress--indeterminate">
            <div class="mdc-linear-progress__buffering-dots"></div>
            <div class="mdc-linear-progress__buffer"></div>
            <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
              <span class="mdc-linear-progress__bar-inner"></span>
            </div>
            <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
              <span class="mdc-linear-progress__bar-inner"></span>
            </div>
          </div>
          <ul class="mdc-list mdc-list--dense">
            <li
              class="mdc-list-item"
              v-for="candidate in candidates"
              :key="candidate"
              @click="chooseResult(candidate)">{{ format(candidate) }}</li>
          </ul>
        </div>
        <div v-show="parsing === false" class="sound-wrapper">
          <canvas class="sound"></canvas>
          <h3 class="record-message">{{ countdown }}</h3>
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
.record .record-message { text-align: center; }
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
let waveTimer = 0
export default {
  name: 'record',
  data () {
    return {
      recording: false,
      cancel: false,
      parsing: false,
      countdown: 5,
      msgbus: null,
      candidates: [],
      needResume: false
    }
  },
  created () {
    this.msgbus = this.$root.msgbus
  },
  mounted () {
    canvas = document.querySelector('.sound')
    canvas.width = document.querySelector('.sound-wrapper').clientWidth
    canvas.height = 200
    ctx = canvas.getContext('2d')
    centre.x = canvas.width / 2
    centre.y = canvas.height / 2
  },
  methods: {
    startRecord () {
      this.candidates = []
      this.countdown = 5
      this.parsing = false
      this.cancel = false
      if (this.$root.mediaStatus === window.Media.MEDIA_RUNNING) {
        this.$root.pause()
        this.needResume = true
      }
      if (audioRecorder) {
        audioRecorder.stopRecord()
        audioRecorder.release()
      }
      audioRecorder = new window.Media(cordova.file.cacheDirectory + 'speech.amr', () => {
        console.log('record done')
        if (this.$root.mediaStatus === window.Media.MEDIA_PAUSED && this.needResume) {
          this.$root.resume()
          this.needResume = false
        }
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
    },
    sayYes () {
      if (audioRecorder) {
        audioRecorder.stopRecord()
        audioRecorder.release()
      }
    },
    processFile () {
      this.parsing = true
      resolveFileEntry(cordova.file.cacheDirectory + 'speech.amr').then(fileEntry => { // get file
        return new Promise((resolve, reject) => {
          fileEntry.file(resolve, reject)
        })
      }).then(file => { // read file content
        return new Promise((resolve, reject) => {
          let reader = new FileReader()
          reader.onerror = reject
          reader.onloadend = () => {
            resolve(reader.result)
          }
          reader.readAsArrayBuffer(file)
        })
      }).then(result => { // get token and speech recognization
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
      }).then(res => { // proecss result
        if (this.cancel) {
          return
        }
        if (res.err_no !== 0) {
          this.$parent.listening = false
          this.$parent.$parent.showMsg(res.err_msg)
          return
        }
        if (res.result.length === 1) {
          this.chooseResult(res.result[0])
        } else {
          this.candidates = res.result
        }
      }).catch(error => {
        console.error(error)
        this.$parent.$parent.showMsg(error)
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
            if (--this.countdown < 1) {
              this.sayYes()
            }
          }, 1000)
          waveTimer = setInterval(() => {
            audioRecorder.getCurrentAmplitude(amp => {
              this.showWave(amp)
            }, console.error)
          }, 100)
          break
        case window.Media.MEDIA_PAUSED:
          console.log('paused')
          break
        case window.Media.MEDIA_STOPPED:
          clearInterval(mediaTimer)
          clearInterval(waveTimer)
          console.log('stopped')
          break
        default:
          console.log('None')
      }
    },
    showWave (amp) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      radius = MIN + amp * RANGE
      ctx.beginPath()
      ctx.arc(centre.x, centre.y, radius, 0, 2 * Math.PI)
      var grd = ctx.createRadialGradient(centre.x, centre.y, 10, centre.x, centre.y, radius)
      grd.addColorStop(0, '#d32f2f')
      grd.addColorStop(0.5, '#ff6659')
      grd.addColorStop(1, '#FFF')
      ctx.fillStyle = grd
      ctx.fill()
    },
    chooseResult (phrase) {
      this.$root.phrase = this.format(phrase)
      this.$parent.listening = false
    },
    format (candidate) {
      return candidate.substr(0, candidate.length - 1)
    }
  }
}
</script>
