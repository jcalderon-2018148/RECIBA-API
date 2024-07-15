'use strict'

const { test } = require('./achievements.controller')

const api = require('express').Router()

api.get('/test', test)

/* PUBLIC ROUTES */

/* ADMIN ROUTES */

module.exports = api