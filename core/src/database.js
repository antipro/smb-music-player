let db = null
let request = window.indexedDB.open('musiclib', 1)
request.onerror = function (evt) {
  console.log('Open Error!', evt)
}
request.onsuccess = function (evt) {
  db = evt.target.result
  db.onerror = function (event) {
    alert('Database error: ' + event.target.errorCode)
  }
}
export default db

request.onupgradeneeded = function (event) {
  console.log('database upgrade')
  db = event.target.result
  let objectStore = db.createObjectStore('folders', { keyPath: 'id', autoIncrement: true })
  objectStore.createIndex('name', 'name', { unique: false })
  objectStore = db.createObjectStore('files', { keyPath: 'id', autoIncrement: true })
  objectStore.createIndex('name', 'name', { unique: false })
  objectStore.createIndex('fid', 'fid', { unique: false })
}
