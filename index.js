'use strict'

require('dotenv').config()
const { connect } = require('./config/mongo')
const { initServer } = require('./config/app')
const { defaultMaster } = require('./src/user/user.controller')
const { defaultRange } = require('./src/range/range.controller')
const { defaultRangeAdmin } = require('./src/range/range.controller')

connect()
defaultMaster()
defaultRange()
defaultRangeAdmin()
initServer()