#!/usr/bin/env node

const fs = require('fs');

var fsCallback = function (err) {
  if (err) {
    console.error("Failed to edit file.");
    throw err;
  }
}
var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS : '');

if (platforms.indexOf('android') > -1) {
  console.log("Edit manifest file");
  let manifestFile = 'platforms/android/app/src/main/AndroidManifest.xml'
  // Copy over the Chinese Resource Files
  fs.stat(manifestFile, (err, stats) => {
    if (stats === undefined || !stats.isFile()) {
      console.error('AndroidManifest.xml not found')
      return
    }
    fs.readFile(manifestFile, 'utf8', function (err, data) {
      if (err) {
        console.error('Unable to find AndroidManifest.xml: ' + err)
      }
      let result = data.replace(/adjustResize/g, 'adjustPan');
      fs.writeFile(manifestFile, result, 'utf8', function (err) {
        if (err) console.error('Unable to write into AndroidManifest.xml: ' + err)
      })
    })
  })
} else {
  console.warn('Android plaform not found');
}
