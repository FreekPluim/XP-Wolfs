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

const userSchema = mongoose.Schema({
    _id: reqString,
    Games: reqArray,
    Discord_Name: reqString,
})

module.exports = mongoose.model('user-schema', userSchema)