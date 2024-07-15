'use strict'

const User = require('../user/user.model')
const Partner = require('./partner.model')
const { validateData, sensitiveData } = require('../utils/validate')
const fs = require('fs');
const path = require('path');
const Reward = require('../reward/reward.model')

exports.test = (req, res) => {
    res.send({ message: 'Test partner' })
}

exports.add = async (req, res) => {
    try {
        let data = req.body
        let params = {
            name: data.name,
            phone: data.phone,
            address: data.address,
            email: data.email,
            admin: data.admin
        }
        let existEmail = await Partner.findOne({ email: data.email })
        if (existEmail) return res.status(418).send({ message: 'This email is already taken, please choose another one' })
        let existPartner = await Partner.findOne({ admin: data.admin })
        if (existPartner) return res.status(418).send({ message: 'That user is already an admin for another partner' })
        let user = User.findOne({ _id: data.admin })
        if (user.role = ! 'PARTNER') return res.status(404).send({ message: 'This admin is not partner' })
        let msg = validateData(params)
        if (msg) return res.status(404).send({ message: msg })

        let partner = new Partner(data)
        await partner.save()

        return res.send({ message: 'Partner successfully created', partner: partner })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error adding new partner' })
    }
}

exports.getAll = async (req, res) => {
    try {
        let parnters = await Partner.find();
        if (!parnters) return res.status(404).send({ message: 'Couldnt find any parnter' });
        return res.send({ partners: parnters })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error gettitng parnters' })
    }
}

exports.get = async (req, res) => {
    try {
        let partnerId = req.params.id
        let partner = await Partner.findOne({ _id: partnerId })
        if (!partner) return res.status(404).send({ message: 'Couldnt find that partner' })
        return res.send({ partner: partner });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting partner' });
    }
}

exports.getByUser = async(req,res)=>{
    try {
       let userId = req.params.id 
       let partner = await Partner.findOne({admin: userId})
       if(!partner) return res.status(404).send({message: 'Couldnt find that partner, please contact to admin to create your partner'})
       return res.send({partner: partner});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error getting partner'});
    }
}

exports.edit = async(req, res)=>{
    try {
        let partnerId = req.params.id
        let data = req.body
        let partner = await Partner.findOne({ _id: partnerId })
        if (data.user != undefined) {
            data.user = undefined
        }
        if (data.email != partner.email) {
            let emailExist = await Partner.findOne({ email: data.email })
            if (emailExist) return res.status(418).send({ message: 'That email is already taked in another partner' })
        }
        let editPartner = await Partner.findOneAndUpdate(
            { _id: partnerId },
            data,
            { new: true }
        )
        if (!editPartner) return res.status(400).send({ message: 'Couldnt uptading partner' })
        return res.send({ message: 'Partner updated succesfully', partner: editPartner })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error editing partner' });
    }
}

exports.del = async (req, res) => {
    try {
        let partnerId = req.params.id

        let deletedRewards = await Reward.deleteMany({ partner: partnerId })
        if (!deletedRewards) return res.status(404).send({ message: 'Couldnt find any partner' })
        
        let deletePartner = await Partner.findOneAndDelete({ _id: partnerId })
        if (!deletePartner) return res.status(404).send({ message: 'Couldnt find an delete partner' })
        return res.send({ message: 'Partner deleted successfully' })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ messag: 'Error deleting partner' })
    }
}

exports.uploadImg = async (req, res) => {
    try {
        const id = req.params.id
        const alreadyImg = await Partner.findOne({ _id: id })
        let pathFile = './src/uploads/partners/'
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
        }

        const upPartner = await Partner.findOneAndUpdate(
            { _id: id },
            { photo: fileName },
            { new: true }
        )
        console.log('Ejecuto esto 1');
        if (!upPartner) return res.status(404).send({ message: 'Parntner not found!' })
        console.log('snsnsnns');
        return res.send({ message: 'Photo added successfully' })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error while uploading img :(', error: err })
    }
}

exports.getImg = async (req, res) => {
    try {
        const fileName = req.params.file
        const pathFile = `./src/uploads/partners/${fileName}`
        const img = fs.existsSync(pathFile)

        if (!img) return res.status(404).send({ message: 'Image not found :(' })

        return res.sendFile(path.resolve(pathFile))

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting img :(', error: err })
    }
}

