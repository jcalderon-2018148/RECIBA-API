'use strict'

const api = require('express').Router()

const { ensureAdvance } = require('../services/authenticated')
const rewardController = require('./reward.controller')
const multiparty = require('connect-multiparty')
const upload = multiparty({ uploadDir: './src/uploads/rewards/' })

//Public routes
api.get('/test', rewardController.test)
api.get('/getImage/:file', [upload], rewardController.getImg)

//Admin routes
api.post('/add', rewardController.addReward)
api.put('/uploadImage/:id', [upload], rewardController.uploadImg)
api.delete('/delete/:id', rewardController.deleteReward)
api.put('/update/:id', rewardController.updateReward)

//Private routes
api.get('/get', rewardController.getRewards)
api.get('/getOne/:id', rewardController.getReward)
api.get('/getByPartner/:id', rewardController.getByPartner)
api.put('/claim/:id', ensureAdvance, rewardController.claim)

module.exports = api