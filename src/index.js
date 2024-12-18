const OpenAI = require("openai")
const { Telegraf } = require("telegraf")
const { message } = require("telegraf/filters")

const configs = require("./configs")
const utils = require("./utils")

/* ===================== SETUP ===================== */

const data = utils.loadData()
setInterval(() => utils.saveData(data), 5000)

const bot = new Telegraf(configs.TELEGRAM_BOT_TOKEN)
const openai = new OpenAI({
    apiKey: configs.OPENAI_API_KEY
})

/* ===================== BOT ===================== */

bot.start(async (ctx) => {
    const chatId = ctx.chat.id
    await ctx.reply(`Hello! Your chat ID is ${chatId}`)
})

/*bot.on(message("text"), async (ctx) => {
    const message = ctx.message.text
    await ctx.reply(`Hai scritto: ${message}`)
})
 */
bot.command('ranking', (ctx) => {
    ctx.reply('ecco la classifica generale')
    console.log(ctx)
    const idchat = ctx.update.message.chat.id
    const arrayOrdinato = data[idchat].sort((utente1,utente2) => utente2.punteggio - utente1.punteggio)
    ctx.reply(arrayOrdinato)
    ctx.reply("ciaobello")
});
/* ===================== LAUNCH ===================== */

bot.launch(() => {
    console.log('the bot is started correctly')
}).catch((err) => {
    console.error('Error starting bot', err)
})

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))