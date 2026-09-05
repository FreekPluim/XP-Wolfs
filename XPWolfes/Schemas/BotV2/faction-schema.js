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

const factionSchema = mongoose.Schema({
    _id: reqString,
    Faction_Name: reqString,
    Faction_Roles: reqArray,
    Faction_Wincondition: reqString,
})

module.exports = mongoose.model('faction-schema', factionSchema)