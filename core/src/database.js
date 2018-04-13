import Dexie from 'dexie'

const db = new Dexie('musiclib')

db.version(1).stores({
  directories: '++id, name, files, url, type, lastupdate',
  files: '++id, name, length, fid, url, type'
})
db.version(2).stores({
  directories: '++id, name, files, url, type, lastupdate',
  files: '++id, name, length, fid, url, type'
}).upgrade(function (trans) {
  trans.directories.add({
    name: 'demo',
    url: 'http://localhost:8080/static/demo/',
    files: 1,
    type: 0,
    lastupdate: new Date()
  }).then(id => {
    trans.files.add({
      name: 'demo.mp3',
      url: 'http://localhost:8080/static/demo/demo.mp3',
      length: '10000',
      fid: id,
      type: 0
    })
  })
})

function randomKeylist (collection, limit) {
  return collection.primaryKeys().then(keyArray => {
    if (keyArray.length <= limit) {
      return Promise.resolve(keyArray)
    }
    let keylist = []
    let cnt = 0
    do {
      let idx = Math.floor(Math.random() * keyArray.length)
      if (keylist.indexOf(idx) === -1) {
        cnt++
        keylist.push(keyArray[idx])
      }
    } while (cnt < limit)
    return Promise.resolve(keylist)
  })
}

export { db, randomKeylist }
