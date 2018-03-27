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

export {
  formatTime
}
