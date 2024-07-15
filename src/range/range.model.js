'use strict'

const mongoose = require('mongoose')

const rangeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        uppercase: true,
        unique: true
    },
    initExp: {
        type: Number,
        required: true
    },
    limitExp: {
        type: Number,
        required: true
    },
    photo: {
        type: String
    }
}, {
    versionKey: false
})

module.exports = mongoose.model('Range', rangeSchema)