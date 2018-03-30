import Dexie from 'dexie'

const db = new Dexie('musiclib')
db.version(1).stores({
  directories: '++id, name, files, url, type, lastupdate',
  files: '++id, name, length, fid, url, type'
})

export default db
