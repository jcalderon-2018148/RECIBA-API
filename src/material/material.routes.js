'use strict'

const api = require('express').Router()
const {ensureAdvance, isRecycler} = require('../services/authenticated')
const materialController = require('./material.controller')
const multiparty = require('connect-multiparty')
const upload = multiparty({uploadDir:'./src/uploads/materials/'})

// Public routes
api.get('/getImage/:file',[upload],materialController.getImg)

// Private routes
api.get('/get',[ensureAdvance],materialController.getMaterials)
api.get('/getOne/:id',[ensureAdvance],materialController.getMaterial)
api.get('/getRecMaterials/:id', [ensureAdvance], materialController.getRecyclerMaterial)

// Admin routes
api.post('/add',[ensureAdvance,isRecycler],materialController.addMaterial)
api.put('/uploadImage/:id',[ensureAdvance,isRecycler,upload],materialController.uploadImgs)
api.put('/set/:id',[ensureAdvance,isRecycler],materialController.editMaterial)
api.delete('/delete/:id',[ensureAdvance,isRecycler],materialController.deleteMaterial)

module.exports = api