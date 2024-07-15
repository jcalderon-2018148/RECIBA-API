'use strict'

const mongoose = require('mongoose')

const achievementSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    head: {
        type: String,
        required: true,
    },
    limitQuant: {
        type: Number,
        required: true,
    },
    exp: {
        type: Number,
        required: true,
    },
    reach: {
        type: Boolean,
        default: false,
    },
    photo: {
        type: String
    }
},{
    versionKey: false
})

module.exports = mongoose.model('Achievement', achievementSchema)