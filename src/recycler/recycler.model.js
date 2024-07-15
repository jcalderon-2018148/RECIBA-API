'use strict'

const mongoose = require('mongoose')

const recycleSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    direction:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    photos: {
        type: [String]
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    startHour: {
        type: Number,
        required: true,
        min: 0,
        max: 23
    },
    endHour: {
        type: Number,
        required: true,
        min: 0,
        max: 23
    }
},{
    versionKey:false
})

module.exports = mongoose.model('Recycle',recycleSchema)