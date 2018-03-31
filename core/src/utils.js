/**
 * format seconds to harmony pattern
 * @param {number} seconds
 * @returns {string} hh:mm:ss
 */
function formatTime (seconds) {
  if (isNaN(parseInt(seconds))) {
    return 'Error'
  }
  if (seconds < 0) {
    return 'Error'
  }
  if (seconds === 0) {
    return '00:00'
  }
  seconds = parseInt(seconds)
  let minutes = parseInt(seconds / 60)
  seconds %= 60
  let output = ''
  if (seconds >= 10) {
    output = seconds
  } else {
    output = '0' + seconds
  }
  if (minutes < 60 && minutes >= 10) {
    return minutes + ':' + output
  } else if (minutes < 10) {
    return '0' + minutes + ':' + output
  }
  let hours = parseInt(minutes / 60)
  minutes %= 60
  if (minutes >= 10) {
    output = minutes + ':' + output
  } else if (minutes < 10) {
    output = '0' + minutes + ':' + output
  }
  if (hours >= 10) {
    output = hours + ':' + output
  } else if (hours < 10) {
    output = '0' + hours + ':' + output
  }
  return output
}

/**
 * format bytes to harmony pattern
 * @param {number} bytes
 * @returns {string} xB or x.yKB or x.yMB
 */
function formatSize (bytes) {
  if (bytes < 1024) {
    return bytes + 'B'
  } else if (bytes >= 1024 && bytes < 1048576) {
    let kb = bytes / 1024
    return kb.toFixed(1) + 'KB'
  } else {
    let mb = bytes / 1048576
    return mb.toFixed(1) + 'MB'
  }
}

/**
 * return FileSystemEntry according to url
 * @param {string} url
 * @returns Promise
 */
function resolveFileEntry (url) {
  return new Promise(function (resolve, reject) {
    window.resolveLocalFileSystemURL(url, fileEntry => {
      resolve(fileEntry)
    }, error => {
      reject(error)
    })
  })
}

/**
 * move file to directory
 * @param {FileSystemEntry} fileEntry
 * @param {FileSystemEntry} dirEntry
 * @param {string} newName
 * @returns Promise
 */
function moveFileEntry (fileEntry, dirEntry, newName) {
  return new Promise(function (resolve, reject) {
    fileEntry.moveTo(dirEntry, newName, newFileEntry => {
      resolve(newFileEntry)
    }, error => {
      reject(error)
    })
  })
}

export {
  formatTime, formatSize, resolveFileEntry, moveFileEntry
}
