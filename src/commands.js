import sketch from 'sketch'
import { SSL_OP_CRYPTOPRO_TLSEXT_BUG } from 'constants';
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
  checkIfMugsyAlreadySaved()
}

export function coffeeNow() {
  var mugsy = getSavedSetting("Mugsy")
  var urlString = "https://cloud.heymugsy.com/sys/userInt/listener.php?key=" + mugsy.key
  //sendErrorMessage(urlString)
  let payload = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    method:'POST',
    body: 'foo=bar&lorem=ipsum'
  };
  fetch(urlString, payload)
  .then(
    function(response) {
      if (response.status !== 200) {
        //sendErrorMessage('Looks like there was a problem. Status Code:\n\n' + response.status);
        sendMessageToBottom("This does not work at the moment: " + response.status)
        return;
      }
      //sendErrorMessage(objectToJson(response))
      response.json().then(function(data) {
        //sendErrorMessage(data)
        sendErrorMessage(data)
      })
      response.text().then(function (text) {
        //sendErrorMessage(text)
        sendMessageToBottom(text)
      })
    }
  )
  .catch(function(err) {
    //sendErrorMessage('Fetch Error:\n\n' + err)
    sendMessageToBottom("This does not work at the moment: " + err)
  });
}

export function setKey() {
  var mugsy = getSavedSetting("Mugsy")
  var string = mugsy.key
  if(string.length <= 1){
    string = "Enter here"
  }
  UI.getInputFromUser(
    "What's the integration key you generated for this plugin?",
    {
      initialValue: string,
    },
    (err, value) => {
      if (err) {
        // most likely the user canceled the input
        return
      }
      else {
        while(value.includes(".")){
          value = value.replace(".", "")
        }
        while(value.includes(" ")){
          value = value.replace(" ", "")
        }
        if(value.length <= 5){
          value = ""
        }
        mugsy.key = value
        setSetting("Mugsy", mugsy)
        sendMessageToBottom("Key saved successfully.")
      }
    }
  )
}

export function showMugsyObject() {
  var sketch = require('sketch/dom')
  var mugsy = getSavedSetting("Mugsy")
  const options = { formats: 'json', output: false }
  const sketchJSON = sketch.export(mugsy, options)
  sendErrorMessage(objectToJson(sketchJSON))
}
