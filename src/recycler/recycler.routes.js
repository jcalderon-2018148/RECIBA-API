'use strict'

const api = require('express').Router()
const {ensureAdvance, isRecycler, isMaster} = require('../services/authenticated')
const recyclerController = require('./recycler.controller')
const multiparty = require('connect-multiparty')
const upload = multiparty({uploadDir:'./src/uploads/recyclers/'})

api.get('/getImage/:file',[upload],recyclerController.getImg)

api.get('/get',[ensureAdvance],recyclerController.getRecyclers)
api.get('/getOne/:id',[ensureAdvance],recyclerController.getRecycler)

api.put('/set/:id',[ensureAdvance,isRecycler],recyclerController.editRecycler)
api.put('/uploadImage/:id',[ensureAdvance,isRecycler,upload],recyclerController.uploadImgs)

api.post('/add',[ensureAdvance,isMaster],recyclerController.addRecycler)
api.delete('/delete/:id',[ensureAdvance,isRecycler],recyclerController.deleteRecycler)
api.get('/getByUser/:user', [ensureAdvance], recyclerController.getByUser)

module.exports = api