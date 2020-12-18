const { Telegraf } = require("telegraf")
require('dotenv').config()

const { getChats, saveChat } = require("./api")
const bot = new Telegraf(process.env.BOT_TOKEN)

const WebSocket = require("ws")
const wss = new WebSocket.Server({ port: 8888 })

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: %s", message)
    getChats((res) => {
      if (res.success) {
        console.log("recive chats: ", res.data)
        res.data.forEach((chat) => {
          bot.telegram.sendMessage(chat.chatId, message)
        })
      }
    })
  })
  ws.send("connected")
})

bot.start((ctx) => {
  const { id: chatId, first_name, last_name } = ctx.chat
  saveChat({ chatId, first_name, last_name }, (res) => {
    if (res.success) {
      console.log("SAVED CHAT:", res.data)
    }
  })
  return ctx.reply("Hey")
})
bot.help((ctx) => ctx.reply("Send me a sticker"))
bot.on("sticker", (ctx) => ctx.reply("👍"))

bot.hears("status", (ctx) => ctx.reply("Alive!"))

bot.hears("vava down", (ctx) => {
  wss.clients.forEach((client) => {
    client.send("vava down")
    //TODO send vava only
  })
}) 
bot.hears("egor down", (ctx) => ctx.reply("Alive!")) //TODO sen egor


bot.launch()
