const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true
}

const reqArray = {
    type: Array,
    default: [],
    required: true
}

const houseSchema = mongoose.Schema({
    _id: reqString,
    Game_ID: reqString,
    House_Members: reqArray,
    House_Channel_ID: String
})

module.exports = mongoose.model('house-schema', houseSchema)
