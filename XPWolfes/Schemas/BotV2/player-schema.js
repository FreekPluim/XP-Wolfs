const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true
}

const playerStatusEnum = {
    type: String,
    enum: ['alive', 'dead', 'undead'],
    default: 'alive',
    required: true
}

const reqArray = {
    type: Array,
    default: [],
    required: true
}

const playerSchema = mongoose.Schema({
    User_ID: reqString,
    Game_ID: reqString,
    Role_ID: String,
    House_ID: String,
    Player_Status: playerStatusEnum,
    Faction_IDs: Array,
    Role_Ability_Fields: Array,
    Using_Ability: Boolean,
    Ability_Uses: Number,
    Visiting_Player_ID: String,
    Channel_ID: String,
    Lynch_Vote: String
})

module.exports = mongoose.model('player-schema', playerSchema)
