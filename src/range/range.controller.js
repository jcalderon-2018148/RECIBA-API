'use strict'

const Range = require('./range.model')
const fs = require('fs')
const path = require('path')
const User = require('../user/user.model')

const { validateData } = require('../utils/validate')

/* TEST */
exports.test = (req, res) => {
    return res.send({ message: 'Test range' })
}

/* DEFAULT RANGE */
exports.defaultRange = async(req, res) => {
    try {
        let range = await Range.findOne({ name: 'JUNIOR' })
        if (range) return console.log('Range default already created in db')
        let data = {
            name: 'JUNIOR',
            initExp: 0,
            limitExp: 1000
        }
        let defRange = new Range(data)
        await defRange.save()
        return console.log('Range default created successfully')
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error creating range default', error: err })
    }
}

exports.defaultRangeAdmin = async(req, res) => {
    try {
        let range = await Range.findOne({ name: 'ADMIN' })
        if (range) return console.log('Range admin default already created in db')
        let data = {
            name: 'ADMIN',
            initExp: 0,
            limitExp: 0
        }
        let defRange = new Range(data)
        await defRange.save()
        return console.log('Range admin default created successfully')
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error creating range default', error: err })
    }
}

/* ADD */
exports.add = async(req, res) => {
    try {
        let data = req.body
        let params = {
            name: data.name,
            initExp: data.initExp,
            limitExp: data.limitExp
        }
        
        let msg = validateData(params)
        if (msg) return res.status(400).send({ msg })

        if (data.initExp >= data.limitExp) return res.status(400).send({ message: 'Please select a coherent exp range' })

        let existRange = await Range.findOne({ initExp: params.initExp })
        if (existRange) return res.status(400).send({ message: 'Another range has been initialized with that initial exp' })
        
        let range = new Range(data)
        await range.save()

        return res.send({ message: 'Range added successfully!', range: range })
                
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error adding range :(', error: err })
    }
}

/* EDIT */
exports.edit = async(req, res) => {
    try {
        let id = req.params.id
        let data = req.body
        let params = {
            name: data.name,
            initExp: data.initExp,
            limitExp: data.limitExp
        }

        let msg = validateData(params)
        if (msg) return res.status(400).send({ msg })

        if (data.initExp >= data.limitExp) return res.status(400).send({ message: 'Please select a coherent exp range' })

        let upRange = await Range.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )

        if (!upRange) return res.status(404).send({ message: 'Range not founded and not updated :(' })

        return res.send({ message: 'Range updated successfully!', range: upRange })
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating range :(', error: err })
    }
}

/* DELETE */
exports.del = async(req, res) => {
    try {
        let id = req.params.id
        let willDelRange = await Range.findOne({ _id: id })

        if (willDelRange.name === 'JUNIOR' || willDelRange.name === 'ADMIN') return res.status(400).send({ message: 'Cannot delete this fundamental range' })
        
        let range = await Range.findOne({ $or: [{limitExp: { $lt: willDelRange.initExp }}, {limitExp: { $eq: willDelRange.initExp }}]  })
        
        let upUsers = await User.updateMany(
            { range: id },
            { range: range._id }
        )

        if (!upUsers) return res.status(404).send({ message: 'Cannot find any range to update the users' })

        let delRange = await Range.findOneAndDelete({ _id: id })
        if (!delRange) return res.status(404).send({ message: 'Range not found and not deleted :(' })

        return res.send({ message: 'Range deleted successfully!', range: delRange })
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting range :(', error: err })
    }
}

/* GET RANGE */
exports.getRange = async(req, res) => {
    try {
        let id = req.params.id

        let range = await Range.findOne({ _id: id })
        if (!range) return res.status(404).send({ message: 'Range not found :(' })

        return res.send({ message: 'Range found!', range: range })
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting range :(', error: err })
    }
}

/* GET RANGES */
exports.get = async(req, res) => {
    try {
        let ranges = await Range.find()
        
        if (ranges.length === 0) return res.status(404).send({ message: 'Ranges not found :(' })

        return res.send({ message: 'Ranges found!', range: ranges })
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting range :(', error: err })
    }
}

/* GET IMAGE */
exports.getImg = async (req, res) => {
    try {
        const fileName = req.params.file
        const pathFile = `./src/uploads/ranges/${fileName}`
        const img = fs.existsSync(pathFile)

        if (!img) return res.status(404).send({ message: 'Image not found :(' })

        return res.sendFile(path.resolve(pathFile))

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting img :(', error: err })
    }
}

/* UPLOAD IMAGE */
exports.uploadImg = async (req, res) => {
    try {
        const id = req.params.id
        const alreadyImg = await Range.findOne({ _id: id })

        let pathFile = './src/uploads/ranges/'

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
            const upRange = await Range.findOneAndUpdate(
                { _id: id },
                { photo: fileName },
                { new: true }
            )

            if (!upRange) return res.status(404).send({ message: 'Range not found!' })
            return res.send({ message: 'Logo added successfully', range: upRange })
        }
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error while updating img :(', error: err })
    }
}