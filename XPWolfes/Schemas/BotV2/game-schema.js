const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true
}

const timeEnum = {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'night'],
    default: 'morning',
    required: true
}

const gameStateEnum = {
    type: String,
    enum: ['not_started', 'preparing', 'in_progress', 'finished'],
    default: 'not_started',
    required: true
}

const string = {
    type: String,
    required: false
}

const reqArray = {
    type: Array,
    default: [],
    required: true
}

const gameSchema = mongoose.Schema({
    _id: reqString,
    Game_Players: reqArray,
    Max_Players: Number,
    Game_Roles: reqArray,
    Guild_ID: reqString,
    Game_State: gameStateEnum,
    Current_Timeslot: timeEnum,
    Timeslot_Start: timeEnum,
    Current_Mayor: string,
    Current_Successor: string,
    Game_Host_ID: reqString,
    Game_Moderators_ID: reqArray,
    Anouncements_Channel_ID: string,
    Game_Chat_ID: string,
    Game_Logs_Chat_ID: string,
    Dead_Chat_ID: string,
})

module.exports = mongoose.model('game-schema', gameSchema)