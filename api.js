const axios = require("axios")

const URL = process.env.URL_API

async function getChats(cb) {
  axios
    .get(URL)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function (error) {
      cb({ success: false, data: error })
    })
}

function saveChat(chat, cb) {
  axios
    .post(URL, chat)
    .then(function (res) {
      cb(res.data)
    })
    .catch(function (error) {
      cb({ success: false, data: error })
    })
}

module.exports = {
  saveChat,
  getChats,
}
