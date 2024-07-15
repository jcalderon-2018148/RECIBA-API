'use strict'

const api = require('express').Router()

const { ensureAdvance, isMaster, authImg, isRecycler } = require('../services/authenticated');
const billController = require('./bill.controller')

//PUBLIC ROUTES
api.get('/test', billController.test)

//PRIVATE ROUTES
api.get('/get', [ensureAdvance], billController.getBills)
api.get('/get/:id', [ensureAdvance], billController.getBill)
api.get('/getOwn', [ensureAdvance], billController.getOwn)

//ADMIN ROUTES
api.post('/create', [ensureAdvance, isRecycler], billController.createBill)
api.get('/getByUser/:id' , [ensureAdvance, isRecycler], billController.getBillsByUser)
api.get('/getByRecycler/:id' , [ensureAdvance, isRecycler], billController.getAllBillsByRecycler)
api.put('/expPts/:id', [ensureAdvance, isRecycler], billController.updateExpPts)
api.put('/bonusPoints/:id', [ensureAdvance, isRecycler], billController.updateBonusPoints)
api.put('/addStreak/:id', [ensureAdvance, isRecycler], billController.addStreak)
api.get('/getRecycler', [ensureAdvance, isRecycler], billController.getRecyclerBills)
api.put('/disableBill/:id', [ensureAdvance, isRecycler], billController.disableBill)

module.exports = api