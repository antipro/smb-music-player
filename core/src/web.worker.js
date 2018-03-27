import db from './database'

onmessage = e => {
  let cifs = e.data[0]
  let directory = e.data[1]
  console.log(cifs)
  db.transaction('rw', db.directories, db.files, async () => {
    await db.files.where('fid').equals(directory.id).delete()
    directory.files = 0
    console.log(self)
    // let callback = async (url) => {
    //   window.cifs.dir(url, files => {
    //     for (const file of files) {
    //       if (file.directory && !file.name.endsWith('$/')) {
    //         callback(file.url)
    //       }
    //       if (!file.directory) {
    //         db.files.put({
    //           name: file.name,
    //           url: file.url,
    //           length: file.length,
    //           fid: directory.id
    //         })
    //         console.log('files++')
    //         directory.files++
    //       }
    //     }
    //   }, error => {
    //     console.log(error)
    //   })
    // }
    // await callback(directory.url)
  }).then(() => {
    directory.lastupdate = new Date()
    return db.directories.put(directory)
  }).then(() => {
    console.log('done')
    postMessage(directory)
  }).catch(error => {
    console.log(error)
  })
}
