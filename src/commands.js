import sketch from 'sketch'
var UI = require('sketch/ui')
var Settings = require('sketch/settings')

function setSetting(stringWhere, stringValue) {
  Settings.setGlobalSettingForKey(stringWhere, stringValue)
}

function getSavedSetting(stringWhere) {
  return Settings.globalSettingForKey(stringWhere)
}

function sendErrorMessage(dataError) {
  UI.alert('Mugsy', String(dataError))
}

function sendMessageToBottom(dataBottom) {
  UI.message(String(dataBottom))
}

function objectToJson(obj) {
  var json = JSON.stringify(obj)
  return json
}

function newMugsyObject() {
  var mugsy = {
    key: "",
    machineSettings: [], // 1 month as standard
    recipes: []
  }
  setSetting("Mugsy", mugsy)
}

function checkIfMugsyAlreadySaved() {
  var a = getSavedSetting("Mugsy")
  if (typeof a != "object") {
    newMugsyObject()
  }
  //sendErrorMessage(objectToJson(getSavedSetting("ArtboardHistory")))
}

export function checkIfAllThisExists() {
  sendErrorMessage("coffee")
  checkIfMugsyAlreadySaved()
}

export function coffeeNow() {
  var sketch = require('sketch/dom')
  var mugsy = getSavedSetting("Mugsy")
  const options = { formats: 'json', output: false }
  const sketchJSON = sketch.export(mugsy, options)
  sendErrorMessage(objectToJson(sketchJSON))
}
