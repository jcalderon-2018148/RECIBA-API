'use strict'

const Achievement = require('./achievements.model')

/* TEST */
exports.test = (req, res) => {
    return res.send({ message: 'Test achievement' })
}

/* DEFAULT ACHIEVEMENT */
exports.defaultAchieve = async(req, res) => {
    try {
        let achieve = await Achievement.findOne({ code: 'DEF1' })
        if (achieve) return console.log('Achievement default already created in db')

        let data = {
            code: 'DEF1',
            name: 'Primeros pasos',
            description: 'Realiza tu primer depósito',
            head: 'Depósitos',
            limitQuant: 1,
            exp: 500,
        }

        let defAchieve = new Achievement(data)
        await defAchieve.save()
        
        return console.log('Achievement default created successfully')
        
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error creating default achievement', error: err })
    }
}

//Validaciones por categorias, asi se puede evaluar cada situacion