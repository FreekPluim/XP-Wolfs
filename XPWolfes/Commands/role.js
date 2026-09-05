const {SlashCommandBuilder, roleMention, channelMention} = require("@discordjs/builders");
const rolesSchema = require("../Schemas/roles-schema")
const mongo = require("../mongo");
const { ChannelFlagsBitField, PermissionFlagsBits } = require("discord.js");
const gen = require("../generalfunctions");
const {eventBus} = require("../MISC/EventBus.js");
const factionSchema = require("../Schemas/faction-Schema.js");
const getters = require("../GeneralApi/Getter.js");
const roleSchema = require("../Schemas/BotV2/role-schema.js");

module.exports = {
    data : new SlashCommandBuilder()
        .setName("role")
        .setDescription("All commands to do with roles")
        .addSubcommand(subcommand =>
            subcommand.setName('Ability_Use')
                .setDescription('Use an ability')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('Ability_Cancel')
                .setDescription('Cancel an ability use')
            )
        ,
    async execute(interaction){
        const {member, options, guild} = interaction;
        const admin = member.permissions.has(PermissionFlagsBits.Administrator)
        if(!admin){
            
            interaction.reply("YOU ARE NOT AN ADMINISTRATOR!!!!");
            return;
        }
        
        await mongo().then(async mongoose => {
            try{
                switch(options.getSubcommand())
                {
                    case "Ability_Use":
                        await handleAbilityUse(options, guild, interaction);
                        return;
                    case "Ability_Cancel":
                        await handleGetAll(guild, interaction);
                        return;
                }  
            } 
            finally{
            }
        })
    }
}

async function handleAbilityUse(options, guild, interaction){

    const game = await getters.GetGame(guild.id);
    const player = await getters.getPlayerByUserID(interaction.user.id, guild.id);
    if(!game || !player){
        gen.reply(interaction, "You are not part of the game or the game has not started yet");
        return;
    }

    const role = await roleSchema.findOne({guildID: guild.id, roleName: options.getString('role_name')})

    if(!role){
        gen.reply(interaction, "The role you where trying to remove the user from was not found")
        return;
    }
    if(!role.roleMembers.includes(options.getUser('user').id)){
        gen.reply(interaction, "The user you where trying to remove from the role is not part of the role")
        return;
    }

    await rolesSchema.updateOne({ guildID: guild.id, roleName: options.getString("role_name") }, { $pull: { roleMembers: options.getUser('user').id } }, { options: { upsert: true } });
    gen.reply(interaction, `user ${options.getUser('user').username} has been removed from the role ${options.getString("role_name")}`)
}