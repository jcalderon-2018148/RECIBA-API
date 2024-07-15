'use strict'

const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    surname:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    phone:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true,
        lowercare: true
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
        uppercase: true,
        enum: ['MASTER', 'PARTNER','RECYCLER', 'CLIENT']
    },
    points: {
        type: Number,
        default: 0
    },
    exp: {
        type: Number,
        default: 0
    },
    exp: {
        type: Number,
        default: 0
    },
    range:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Range',
        required: true
    },
    photo:{
        type: String
    },
    streakMaterial: {
        type: Number,
        default: 0
    },
    historyRewards: {
        type: Array,
        default: []
    },

},{
    versionKey: false
});

module.exports = mongoose.model('User', userSchema);