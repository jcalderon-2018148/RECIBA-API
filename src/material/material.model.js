'use strict'

const mongoose = require('mongoose')

const materialSchema = mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true,
        lowerCase: true,
        enum: ['pound', 'ounce', 'kilogram', 'gram', 'unit']
    },
    price: {
        quantity: { // COMPRA DE BASE
            type: Number,
            required: true
        },
        amount: { // PRECIO POR ESA BASE
            type: Number,
            required: true
        }
    },
    photo: {
        type: String
    },
    recycle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recycle',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['ENABLED', 'DISABLED'],
        default: 'ENABLED'
    }
}, {
    versionKey: false
})

module.exports = mongoose.model('Material', materialSchema) 