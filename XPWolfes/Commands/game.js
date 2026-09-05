const {SlashCommandBuilder } = require("@discordjs/builders");
const userdata = require("../Schemas/BotV2/user-schema")
const playerdata = require("../Schemas/BotV2/player-schema")
const gamedata = require("../Schemas/BotV2/game-schema")
const mongo = require("../mongo");
const gen = require("../generalfunctions")
const {PermissionFlagsBits } = require("discord.js");


module.exports = {
    data : new SlashCommandBuilder()
        .setName("game")
        .setDescription("Basic game commands")
        .addSubcommand(subcommand =>
            subcommand.setName('join')
                .setDescription('Use when you want to join')
        ),
    async execute(interaction){
        const {member, options, guild, client} = interaction;
        const admin = member.permissions.has(PermissionFlagsBits.Administrator)
        
        await mongo().then(async mongoose => {
            try{
                if(!admin || admin){
                    switch(options.getSubcommand())
                    {
                        case "join":
                            await handleJoin(guild, interaction, client);
                            return;
                    }
                }
                else{
                    gen.reply(interaction, "You are not allowed to run this command")
                }
            } 
            finally{
                
            }
        })
    }
}//Done

async function handleJoin(guild, interaction, client)
{
    const game = await gamedata.findOne({_id: guild.id});
    const user = await userdata.findOne({_id: interaction.user.id})
    const player = await playerdata.findOne({User_ID: interaction.user.id, Game_ID: guild.id})

    //Check if there is a game
    if(!game || game.Game_State != "preparing"){
        await gen.reply(interaction, "The game is not in the preparing state or the game was not created yet.");
        return;
    }

    //Check if the game is full
    if(game.Game_Players.length >= game.Max_Players){
        await gen.reply(interaction, "The game is already full");
        return;
    }

    //Set general user data
    if(!user){ 
        await userdata.create({
            _id: interaction.user.id,
            Games: [game._id],
            Discord_Name: gen.getName(interaction, interaction.user.id)
        })
        console.log(`Created user ${interaction.user.id} in the database`)
    }
    else{
        if(!user.Games.includes(guild.id)){
            await userdata.updateOne({ _id: user }, { $push: { "Games": guild.id } }, { options: { upsert: true } });
    }
    }

    if(!player){
        await playerdata.create({
            User_ID: interaction.user.id,
            Game_ID: guild.id,
            Player_Status: "alive",
            Faction_IDs: [],
            Role_Ability_Fields: [],
            Using_Ability: false,
            Ability_Uses: 0,
        })
        console.log(`Created player ${interaction.user.id} in the database`)
    }
    else{
        await playerdata.updateOne(
            { User_ID: interaction.user.id, Game_ID: guild.id }, 
            { $set: { "Player_Status": "alive", "Faction_IDs": [], "Role_Ability_Fields": [], "Using_Ability": false, "Ability_Uses": 0 } }, 
            { options: { upsert: true } });
    }
}
