'use strict'

const api = require('express').Router()
const {ensureAdvance, isPartner, isMaster, authImg} = require('../services/authenticated')
const {test, add, getAll, get, edit, del, uploadImg, getImg, getByUser} = require('./partner.controller')
const connectMultiparty = require('connect-multiparty')
const upload = connectMultiparty({uploadDir:'./src/uploads/partners/'})

//Public routes
api.get('/test', test)
api.get('/getImage/:file', [upload], getImg)


//Admin routes
api.post('/add', [ensureAdvance, isMaster], add);
api.put('/update/:id', [ensureAdvance, isPartner], edit);
api.delete('/delete/:id', [ensureAdvance, isMaster], del);
api.put('/uploadImage/:id', [ensureAdvance, authImg, upload], uploadImg)

//Private routes
api.get('/get/:id', [ensureAdvance], get);
api.get('/get', [ensureAdvance], getAll);
api.get('/getByUser/:id',[ensureAdvance], getByUser)

module.exports = api