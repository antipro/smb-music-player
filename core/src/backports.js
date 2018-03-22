/* eslint no-extend-native:off */
import Promise from 'es6-promise'

if (window.Promise === undefined) {
  window.Promise = Promise
}

if (Array.prototype.find === undefined) {
  Array.prototype.find = function (val) {
    for (let idx = 0; idx < this.length; idx++) {
      const ele = this[idx]
      if (typeof val === 'function' && val(ele)) {
        return ele
      } else if (ele === val) {
        return ele
      }
    }
    return undefined
  }
}

if (Array.prototype.findIndex === undefined) {
  Array.prototype.findIndex = function (val) {
    for (let idx = 0; idx < this.length; idx++) {
      const ele = this[idx]
      if (typeof val === 'function' && val(ele)) {
        return idx
      } else if (ele === val) {
        return idx
      }
    }
    return undefined
  }
}

if (String.prototype.startsWith === undefined) {
  String.prototype.startsWith = function (str) {
    return this.indexOf(str) === 0
  }
}
