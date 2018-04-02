#!/usr/bin/env node

const fs = require('fs');

var fsCallback = function (err) {
  if (err) {
    console.error("Failed to create directory or file.");
    throw err;
  }
}
var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS : '');

if (platforms.indexOf('android') > -1) {
  console.log("Adding extra build gradle for android");
  // Copy over the Chinese Resource Files
  fs.stat('platforms/android/app', (err, stats) => {
    if (stats === undefined || !stats.isDirectory()) {
      fs.mkdir('platforms/android/app', fsCallback);
    }
    fs.copyFile('res/build-extras.gradle', 'platforms/android/app/build-extras.gradle', fsCallback);
  })
} else {
  console.warn('Extra build gradle were NOT added for Android');
}