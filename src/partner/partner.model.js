'use strict'

const mongoose = require('mongoose')

const partnerSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    photo: {
        type: String
    }
},{
    versionKey: false
})

module.exports = mongoose.model('Partner', partnerSchema);