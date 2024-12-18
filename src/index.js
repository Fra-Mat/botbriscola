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
    await ctx.reply(`Ciao! Sono il BriscoloneBot. Inserisci il nome del tuo giocatore preceduto da /createuser 😎 `)
})

const arr_user = []
const arr_alias = []

bot.command('crea', async (ctx) => {
        /*const alias = ctx.payload
        const telegramid = ctx.message.from
        const user = telegramid.username*/
        //console.log(ctx)
        // 
        const arraysplit = ctx.payload.split("-");
        let alias = arraysplit[0]
        let user = arraysplit[1]
        //console.log(alias)
        console.log(user)
        arr_user.push(user)
        arr_alias.push(alias)

        await ctx.reply(`Benissimo! Ciao ${user}; Il nome che hai selezionato è ${alias}. `)

        console.log(arr_user)
        console.log(arr_alias)

         
})
bot.command('log', async (ctx) => {
    console.log(ctx)
    
})



//// TO - DO 
//listare gli utenti, segnare punteggi utenti
// listare le info di (tutti?) gli utenti

/* ===================== LAUNCH ===================== */

bot.launch(() => {
    console.log('Il bot funziona ;D')
}).catch((err) => {
    console.error('Il bot NON funziona :(', err)
})

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))