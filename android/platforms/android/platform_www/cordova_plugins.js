cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-inappbrowser.inappbrowser",
    "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
    "pluginId": "cordova-plugin-inappbrowser",
    "clobbers": [
      "cordova.InAppBrowser.open",
      "window.open"
    ]
  },
  {
    "id": "cordova-plugin-cifs.cifs",
    "file": "plugins/cordova-plugin-cifs/www/cifs.js",
    "pluginId": "cordova-plugin-cifs",
    "clobbers": [
      "cifs"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-inappbrowser": "2.0.2",
  "cordova-plugin-whitelist": "1.3.3",
  "cordova-plugin-crosswalk-webview": "2.4.0",
  "cordova-plugin-cifs": "1.0.0"
};
// BOTTOM OF METADATA
});