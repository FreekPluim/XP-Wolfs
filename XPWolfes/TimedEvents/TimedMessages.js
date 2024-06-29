const mongo = require("../mongo");
const gameData = require("../Schemas/game-data")
const gen = require("../generalfunctions.js");
const { userMention, Colors } = require("discord.js");
const {eventBus} = require('../MISC/EventBus.js')


module.exports = {
    async execute(client){
        await mongo().then(async mongoose => {
            try{
                const currentDate = new Date();
                hours  = ('0'+currentDate.getHours()).substr(-2);
                minutes = ('0'+currentDate.getMinutes()).substr(-2);
                let timeString = `${hours}:${minutes}`;

                const morningGames = await gameData.find({times: {$elemMatch:{morning: timeString}}, started: false, finished: false})
                const afternoonGames = await gameData.find({times: {$elemMatch:{afternoon: timeString}}, started: false, finished: false})
                const eveningGames = await gameData.find({times: {$elemMatch:{evening: timeString}}, started: false, finished: false})
                const nightGames = await gameData.find({times: {$elemMatch:{night: timeString}}, started: false, finished: false})

                if(morningGames.length > 0){ 
                    //Handle morning loop
                    await morningLoop(client, morningGames)
                }

                if(afternoonGames.length > 0){ 
                    //Handle morning loop
                    await afternoonLoop(client, afternoonGames)
                }

                if(eveningGames.length > 0){ 
                    //Handle morning loop
                    await eveningLoop(client, eveningGames)
                }

                if(nightGames.length > 0){ 
                    //Handle morning loop
                    await nightLoop(client, nightGames)
                }
            }
            finally{

            }
    })
}
}

async function morningLoop(client, games){
    games.forEach(async game => {
        await handleMorning(client, game)
    });
}
async function handleMorning(client, game){

    await gameData.updateMany({started: true, finished: false}, {$inc: {day: 1}}, {options: {upsert: true}})
    
    //Send day inc feedback
    gen.SendFeedback(game._id, "New Day", game.day + 1 + " has started", client);
    
    eventBus.deploy('morning', [client, game])
    
    // //Kill everyone that needs to be killed
    await gen.killNightKilled(client, game)
}

//Afternoon
async function afternoonLoop(client, games){
    games.forEach(async game => {
        await handleAfternoon(client, game)
    });
}
async function handleAfternoon(client, game)
{
    eventBus.deploy('afternoon', [client, game])
    gen.SendFeedback(game._id, "Afternoon day " + game.day,  "Afternoon has started", client);
}

//Evening
async function eveningLoop(client, games){
    games.forEach(async game => {
        await handleEvening(client, game)
    });
}
async function handleEvening(client, game)
{
    eventBus.deploy('evening', [client, game])
    gen.SendFeedback(game._id, "Evening day " + game.day, "Evening has started", client);
}

//Night
async function nightLoop(client, games){
    await games.forEach(async game => {
        await handleNight(client, game)
    });
}
async function handleNight(client, game)
{
    await gen.SendFeedback(game._id, "Night day " + game.day,  "Night has started", client);
    await eventBus.deploy('night', [client, game])
}