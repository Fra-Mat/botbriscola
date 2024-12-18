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
<<<<<<< HEAD
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
=======
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
>>>>>>> 2a26ffff862418edc49b8f04e16392746a5fc2d8
})

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))