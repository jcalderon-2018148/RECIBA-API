'use strict'

const Reward = require('./reward.model')
const User = require('../user/user.model')

const { validateData } = require('../utils/validate')
const fs = require('fs')
const path = require('path')

/* TEST */
exports.test = (req, res) => {
    return res.send({ message: 'Test range' })
}

/* ADD REWARD */
exports.addReward = async (req, res) => {
    try {
        const data = req.body;
        const params = {
            name: data.name,
            description: data.description,
            partner: data.partner,
            range: data.range,
            cantPoints: data.cantPoints
        }

        const msg = validateData(params)
        if (msg) {
            return res.status(404).send(msg)
        }

        const reward = new Reward(params)
        await reward.save()

        return res.send({ message: 'Reward created succesfully.', reward })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Internal Server Error (AddReward)' })
    }
}

/* GET ALL REWARDS */
exports.getRewards = async (req, res) => {
    try {
        const rewards = await Reward.find().populate('partner').populate('range')
        return res.send({ message: 'Rewards found:', rewards })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Internal Server Error (GetRewards)' })
    }
}

/* GET BY PARTNER */
exports.getByPartner = async (req, res) => {
    try {
        const id = req.params.id
        const rewards = await Reward.find({ partner: id }).populate('partner').populate('range')

        if (rewards.length === 0) 
            return res.status(404).send({ message: 'Rewards not found' })

        return res.send({ message: 'Rewards founded', rewards })
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Internal Server Error (GetByPartner)'})
    }
}

/* FIND ONE REWARD */
exports.getReward = async (req, res) => {
    try {
        const idReward = req.params.id;
        const reward = await Reward.findOne({ _id: idReward }).populate('partner').populate('range')
        if (!reward) {
            return res.status(404).send({ message: 'Reward not found.' })
        }
        return res.send({ message: 'Reward found:', reward })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Internal Server Error (GetReward)' })
    }
}

/* DELETE REWARD */
exports.deleteReward = async (req, res) => {
    try {
        const idReward = req.params.id
        const deleteReward = await Reward.findOneAndDelete({ _id: idReward }).populate('partner').populate('range')
        if (!deleteReward) {
            return res.status(404).send({ message: 'Reward not found.' })
        }
        return res.send({ message: 'Reward deleted:', deleteReward })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Internal Server Error (DeleteReward)' })
    }
}

/* UPDATE REWARD */
exports.updateReward = async (req, res) => {
    try {
        const idReward = req.params.id
        const data = req.body;
        const params = {
            name: data.name,
            description: data.description,
            range: data.range,
            cantPoints: data.cantPoints
        }
        const msg = validateData(params)
        if (msg) {
            return res.status(404).send(msg)
        }
        const updateReward = await Reward.findOneAndUpdate(
            { _id: idReward },
            params,
            { new: true, runValidators: true }
        )
        if (!updateReward) {
            return res.status(404).send({ message: 'Reward not found.'})
        }
        return res.send({ message: 'Reward updated succesfully.', updateReward })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Internal Server Error (UpdateReward)' })
    }
}

/* ----- UPLOAD PHOTO ----- */
exports.uploadImg = async (req, res) => {
    try {

        const id = req.params.id
        const alreadyImg = await Reward.findOne({ _id: id })
        let pathFile = './src/uploads/rewards/'

        if (alreadyImg.photo) fs.unlinkSync(`${pathFile}${alreadyImg.photo}`)
        if (!req.files.image || !req.files.image.type) return res.status(400).send({ message: 'Have not sent an image :(' })

        const filePath = req.files.image.path

        const fileSplit = filePath.split('\\')
        const fileName = fileSplit[3]

        const extension = fileName.split('\.')
        const fileExt = extension[1]

        if (
            fileExt !== 'png' &&
            fileExt !== 'jpg' &&
            fileExt !== 'jpeg'
        ) {
            fs.unlinkSync(filePath)
            return res.status(400).send({ message: 'File extension not admited' })
        } else {
            const upReward = await Reward.findOneAndUpdate(
                { _id: id },
                { photo: fileName },
                { new: true }
            )
            if (!upReward) return res.status(404).send({ message: 'Reward not found!' })
            return res.send({ message: 'Photo added successfully', reward: upReward })
        }

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error while uploading img :(', error: err })
    }
}

/* ----- GET PHOTO ----- */
exports.getImg = async (req, res) => {
    try {
        const fileName = req.params.file
        const pathFile = `./src/uploads/rewards/${fileName}`
        const img = fs.existsSync(pathFile)

        if (!img) return res.status(404).send({ message: 'Image not found :(' })

        return res.sendFile(path.resolve(pathFile))

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting img :(', error: err })
    }
}

/* ----- CLAIM REWARD ----- */
exports.claim = async (req, res) => {
    try {
        const id = req.params.id
        const user = req.user.sub

        const userInfo = await User.findOne({ _id: user })

        const reward = await Reward.findOne({ _id: id }).populate('partner').populate('range').lean()
        if (!reward) return res.status(404).send({ message: 'Reward not found :(' })

        const userHistory = await User.findOne({ _id: user }).lean()

        let history = userHistory.historyRewards
        
        for (let item of history) {
            //Si el id del item que se va a reclamar no esta en los que ya estan en el array, continuar
            if (item._id.toString() !== id) continue

            //Verificar que tenga los puntos necesarios
            let diff = userInfo.points - reward.cantPoints
            if (diff < 0) return res.status(400).send({ message: `Insuficient points :( you need at least '${item.cantPoints}pts' to claim this reward` })
            
            //Calcular exp
            let exp = reward.cantPoints * 0.10
            
            let upHistory = await User.findOneAndUpdate(
                { _id: user, historyRewards: { $elemMatch: { _id: item._id } } },
                { $inc: { 'historyRewards.$.claims': 1, points: -(reward.cantPoints), exp: exp } },
                { new: true }
            )
            await Reward.findOneAndUpdate(
                {_id:id},
                {$inc:{claims:1}},
                {new:true}
            )
            if (!upHistory) return res.status(404).send({ message: 'Error, item not found' })
                
            return res.send({ message: 'Reward claimed successfully', upHistory })
        }

        let diff = userInfo.points - reward.cantPoints
        if (diff < 0) return res.status(400).send({ message: `Insuficient points :( you need at least '${reward.cantPoints}pts' to claim this reward` })

        let rewardClaimed = {
            _id: reward._id,
            name: reward.name,
            description: reward.description,
            partner: reward.partner,
            range: reward.range,
            cantPoints: reward.cantPoints,
            photo: reward.photo,
            claims: 1
        }

        let exp = reward.cantPoints * 0.10

        let upHistory = await User.findOneAndUpdate(
            { _id: user },
            { 
                $push: { historyRewards: rewardClaimed },
                $inc: { points: -(reward.cantPoints), exp: exp }
            },
            { new: true }
        )
        await Reward.findOneAndUpdate(
            {_id:id},
            {$inc:{claims:1}},
            {new:true}
        )
        if (!upHistory) return res.status(404).send({ message: 'User not found :(', error: err })
        return res.send({ message: 'Reward claimed successfully', upHistory })
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error claiming reward :(', error: err })
    }
}