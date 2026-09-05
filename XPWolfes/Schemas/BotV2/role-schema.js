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

const reqArray = {
    type: Array,
    default: [],
    required: true
}

const roleSchema = mongoose.Schema({
    _id: reqString,
    Role_Name: reqString,
    Role_Ability_Priority: Number,
    Role_Ability_Timeslot: timeEnum,
    Role_Ability_Fields_Default: reqArray,
    Role_Ability_Uses: Number
})

module.exports = mongoose.model('role-schema', roleSchema)
