const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const app = express()
const port = process.env.PORT || 3033
/* ROUTES */
const rangeRoutes = require('../src/range/range.routes');
const userRoutes = require('../src/user/user.routes');
const partnerRoutes = require('../src/partner/partner.routes');
const recyclerRoutes = require('../src/recycler/recycler.routes')
const materialRoutes = require('../src/material/material.routes')
const rewardRoutes = require('../src/reward/reward.routes')
const billRoutes = require('../src/bill/bill.routes')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use('/range', rangeRoutes);
app.use('/user', userRoutes);
app.use('/partner', partnerRoutes);
app.use('/recycler', recyclerRoutes);
app.use('/material', materialRoutes);
app.use('/reward', rewardRoutes)
app.use('/bill', billRoutes)


/* START SERVER */
exports.initServer = () => {
    app.listen(port)
    console.log(`Server HTTP running in port ${port}`)
}