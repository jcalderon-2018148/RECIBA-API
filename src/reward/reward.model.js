'use strict'

const mongoose = require('mongoose')

const rewardSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner',
        required: true
    },
    range: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Range',
        required: true
    },
    cantPoints: {
        type: Number,
        required: true
    },
    claims:{
        type:Number,
        default:0
    },
    photo: {
        type: String
    }
}, {
    versionKey: false
})

module.exports = mongoose.model('Reward', rewardSchema)