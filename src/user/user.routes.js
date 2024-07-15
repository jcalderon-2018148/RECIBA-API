'use strict'

const api = require('express').Router()
const { ensureAdvance, isMaster, authImg } = require('../services/authenticated');
const { test, login, register, update, del, updatePassword, save, updateUser, delUser, get, getUser, getUserByUsername, uploadImg, getImg, getOwn, checkRange, getClients } = require('./user.controller')
const connectMultiparty = require('connect-multiparty')
const upload = connectMultiparty({ uploadDir: './src/uploads/users/' })

api.get('/test', test)

//PUBLIC ROUTES
api.post('/login', login)
api.post('/register', register)
api.get('/getImg/:file', upload, getImg)
api.put('/registerImg/:id', [upload], uploadImg)

//PRIVATE ROUTES
api.get('/getOwn', ensureAdvance, getOwn)
api.put('/update', ensureAdvance, update)
api.delete('/delete', ensureAdvance, del)
api.put('/updatePassword', ensureAdvance, updatePassword)
api.put('/uploadImg/:id', [ensureAdvance, authImg, upload], uploadImg)
api.get('/checkRange', [ensureAdvance], checkRange)

//ADMIN ROUTES
api.get('/get', [ensureAdvance], get)
api.get('/get/:id', [ensureAdvance], getUser)
api.get('/getByUsername/:username', [ensureAdvance], getUserByUsername)
api.get('/getOwn', [ensureAdvance], getOwn)
api.get('/getClients', [ensureAdvance], getClients)

//MASTER ROUTES
api.post('/save', [ensureAdvance, isMaster], save)
api.put('/update/:id', [ensureAdvance, isMaster], updateUser)
api.delete('/delete/:id', [ensureAdvance, isMaster], delUser)

module.exports = api