'use strict'

const api = require('express').Router()

const { ensureAdvance, isMaster } = require('../services/authenticated')
const { test, add, edit, del, getRange, get, getImg, uploadImg } = require('./range.controller')
const multiparty = require('connect-multiparty')
const upload = multiparty({ uploadDir: './src/uploads/ranges/' })

/* PUBLIC ROUTES */
api.get('/test', test)
api.get('/get/:id', getRange)
api.get('/get', get)
api.get('/getImage/:file', [upload], getImg)

/* ADMIN ROUTES */
api.post('/add', [ensureAdvance, isMaster], add)
api.put('/edit/:id', [ensureAdvance, isMaster], edit)
api.delete('/delete/:id', [ensureAdvance, isMaster], del)
api.put('/uploadImage/:id', [ensureAdvance, isMaster, upload], uploadImg)

module.exports = api