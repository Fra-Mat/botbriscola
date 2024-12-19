//// TO - DO 
//listare gli utenti, segnare punteggi utenti
// listare le info di (tutti?) gli utenti


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
let autocall = false
bot.start(async (ctx) => {
    const chatId = ctx.chat.id
    ctx.reply(`Ciao! Sono il BriscoloneBot. Permi /help per scoprire tutte le funzioni che questo mirabolante (e poco funzionante) bot può fare 😎 `)
})

const arr_user = []
const arr_alias = []
const arr_punteggi =[]
const utenti = []
let id_chiamante = 0
let id_chiamato = 0
let chiamato = ""
let chiamante = ""
let max = ""
let max_punteggi = 0
let risultato = 0
let conta = 0 
//CREATE
bot.command('create', async (ctx) => {

    let nomisplit = ctx.payload.split("-")
    let alias_obj = nomisplit[0]
    let user_obj = nomisplit[1]
    utenti.push({
        alias: alias_obj,
        user: user_obj,
        punti: 0,
    })
    ctx.reply(`Punteggio registrato. Ciao ${utenti[conta].user}, il nome che hai scelto è ${utenti[conta].alias}`)
    console.log(utenti)
    conta++;
},
//////LISTA
bot.command('list', async (ctx) =>{
        if(utenti.length === 0){
            ctx.reply("Nessun utente registrato al momento. Utilizza il comando /crea [ALIAS]-[USER] per creare un nuovo utente.")
        }else{
            await ctx.reply("USER         ALIAS       PUNTI ATTUALI")
            let j = 0
            while(j<utenti.length){
                ctx.reply(`${j+1}: ${utenti[j].user}       ${utenti[j].alias}    ${utenti[j].punti} punti`)
                j = j + 1
            }  
        }

    

}),
//TYPESET -- SETTA LA MODALITA' DI GIOCO 
bot.command("typeset", async (ctx) =>{
    const arraytipo = ctx.payload
    if(arraytipo == "standard"){
        autocall = false 
        console.log(autocall)
        ctx.reply("Modalità corrente = STANDARD")
    }
    if(arraytipo == "autocall"){
        autocall = true
        console.log(autocall)
        ctx.reply("Modalità corrente = AUTOCALL")
        
    }
    if(arraytipo != "autocall" && arraytipo != "standard"){
        await ctx.reply("Comando non valido. Per settare un tipo di match, digita /typeset seguito da [standard] o [autocall]. Ad ogni inizializzazione, la modalità è settata su standard.")

    }
}),

bot.command("match", async (ctx) =>{

    //////////////////////////////////////////////////////////////////////////STANDARD/////////////////////
    if(autocall == false)  
        {   
            const matchsplit = ctx.payload.split("-");
            chiamante = matchsplit[0]
            chiamato = matchsplit[1]
            risultato = matchsplit[2]
            console.log(matchsplit)
            //RICERCA CHIAMANTE
            for(let i = 0; i<utenti.length; i++){
                if(utenti[i].alias === chiamante){
                    id_chiamante = i
                }
            }

            }
            //RICERCA CHIAMATO
            for (let j = 0; j < utenti.length; j++) {
                if (utenti[j].alias === chiamato){
                    id_chiamato = j
                }
     
            }
            //---------------------risultato e punti
            //situazione vincita chiamante
            if(risultato=="w"){
 
                utenti[id_chiamante].punti = utenti[id_chiamante].punti + 3
                utenti[id_chiamato].punti = utenti[id_chiamato].punti + 2
                //altri = -1

                for(let i =0; i<utenti.length; i++){
                        utenti[i].punti = utenti[i].punti -1

                }
                console.log(utenti) 
            }
            //situazione perdita chiamante, vincita chiamato
            if(risultato=="l"){
                utenti[id_chiamante].punti = utenti[id_chiamante].punti - 3
                utenti[id_chiamato].punti = utenti[id_chiamato].punti - 2
                //altri = +1
                for(let j =0; j<utenti.length; j++){
                        utenti[j].punti = utenti[j].punti +1
                }

                console.log(utenti) 

            }
            ctx.reply("Punteggio registrato!")
        }));


    //////////////////////////////////////////////////////////////////////////AUTOCALL///////////////////////////////




    /*if(autocall === true){
        const autocallsplit = ctx.payload.split("-");
        chiamante = autocallsplit[0]
        risultato = autocallsplit[1]
        console.log(autocallsplit)
        //RICERCA CHIAMANTE
        for(let l = 0; l<utenti.length; l++){
            if(utenti[l].alias === chiamante){
                id_chiamante = l
            }
        }
        console.log(id_chiamante)

        if(risultato=="w"){
            utenti[id_chiamante].punti = (utenti[id_chiamato].punti) +5
            //altri = -1 each
            for(let m =0; m<utenti.length; m++){
                    utenti[m].punti = utenti[m].punti -1
                } 
            }


        }
        if(risultato=="l"){
            utenti[id_chiamante].punti = utenti[id_chiamato].punti -5
            //altri = +1 each
            for(let n =0; n<utenti.length; n++){

                utenti[n].punti = utenti[n].punti +1
            }

            console.log(utenti) 

       
    
        // reply col risultato
        ctx.reply("Punteggio registrato!")
    

        
    }   */

    
        



//HELP!!!
bot.command('help', async (ctx) => {
    await ctx.reply("Ecco qui tutte le azioni che puoi fare con questo bot!")
    await ctx.reply("/create [alias]-[telegramusername] --> Prima di tutto, con questa opzione potrai creare un giocatore collegato ad un username. È consigliato crearene 5.")
    await ctx.reply("/list --> Con cui puoi visualizzare la lista di utenti registrati per questa partita.")
    await ctx.reply("/typeset [MODALITA'] --> Per settare i due tipi di gioco. [standard] è la modalità standard, con chiamante o chiamato, mentre [autocall] è la modalità con chiamata in mano.")
    await ctx.reply("/match --> Per segnare i punti del gioco")
    await ctx.reply("/ranking --> Visualizza la classifica attuale.")
})





bot.command('ranking', async (ctx) => {
    let rank = utenti.sort((a, b) => parseFloat(b.punti) - parseFloat(a.punti));
    console.log(rank)
    if(utenti.length === 0){
        ctx.reply("Nessun utente registrato al momento, classifica vuota. Utilizza il comando /crea [ALIAS]-[USER] per creare un nuovo utente.")
    }else{
        await ctx.reply('Ecco il ranking:')
        await ctx.reply("CLASSIFICA         ALIAS DI       PUNTI ATTUALI")
        let j = 0
        while(j<utenti.length){
            ctx.reply(`Posizione ${j+1}: ${rank[j].alias}       ${rank[j].alias}    ${rank[j].punti} punti`)
            j = j + 1
        }  
    }

    


},

/* ===================== LAUNCH ===================== */

bot.launch(() => {
    console.log('the bot is started correctly')
}).catch((err) => {
    console.error('Error starting bot', err)
}),

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT")),
process.once("SIGTERM", () => bot.stop("SIGTERM")))