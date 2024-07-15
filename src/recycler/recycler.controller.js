'use strict'

const User = require('../user/user.model');
const { isImg } = require('../utils/validate');
const Recycler = require('./recycler.model')
const fs = require('fs');
const path = require('path');

exports.addRecycler = async (req, res) => {
    try {
        /*Obtener los datos entrantes*/
        let data = req.body
        let userLogged = req.user
        /*Buscar que los datos con dependencias existan y no esten tomados ya */
        let existsUser = await User.findOne({ _id: userLogged.sub, role: 'MASTER' })
        if (!existsUser) return res.status(404).send({ message: 'Account not found or role is not MASTER' })
        let existEmail = await Recycler.findOne({ email: data.email })
        if (existEmail) return res.status(418).send({ message: 'This email is already taken, please choose another one' })
        let existRecycler = await Recycler.findOne({user: data.user})
        if(existRecycler) return res.status(418).send({message: 'That user is already an admin for a recycler'})
        /*Validar que venga user */
        if (data.user == null || data.user == undefined) return res.status(401).send({ message: `Can not select that user  ${data.user}` })
        /*Guardar */
        let newRecycler = new Recycler(data)
        let recycler = await newRecycler.save()
        return res.send({ message: 'Recycler save successfully', recycler: recycler })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error adding recycler' })
    }
}

exports.getRecyclers = async (req, res) => {
    try {
        /*Obtener los datos y retornar*/
        let userLogged = req.user
        let recyclers = await Recycler.find()
        return res.send({ recyclers })
    } catch (err) {
        return res.status(500).send({ message: 'Error getting Recyclers' })
    }
}

exports.getRecycler = async (req, res) => {
    try {
        /*Obtener el id a buscar */
        let userLogged = req.user
        let idRecycler = req.params.id
        /*BUscar y retornar */
        let recycler = await Recycler.findOne({ _id: idRecycler })
        if (!recycler) return res.status(404).send({ message: 'Recycler not found please check the id' })
        return res.send({recycler: recycler })
    } catch (err) {
        return res.status(500).send({ message: 'Error getting Recyclers' })
    }
}

exports.getImg = async (req, res) => {
    try {
        /*Obtener el archivo y guardarlo en la ruta*/ 
        const { file } = req.params;
        const url = `./src/uploads/recyclers/${file}`
        const img = fs.existsSync(url)
        /*retornarlo*/
        if (!img)
            return res.status(404).send({ message: 'Image not found' });
        return res.sendFile(path.resolve(url));
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting img', error: err })
    }
}

exports.uploadImgs = async (req, res) => {
    try {
        if (!req.files.images)
            return res.status(400).send({ message: 'Have not sent images' });
        const imgs = req.files.images;
        let names = [];
        const reciclerId = req.params.id;
        const url = './src/uploads/recyclers/';
        const recycler = await Recycler.findOne({ _id: reciclerId });
        if (recycler) {
            if (recycler.photos.length > 0) {
                for (let photo of recycler.photos)
                    fs.unlinkSync(`${url}${photo}`);
            }
            let fP, fN, fE, fS, e;
            if (Array.isArray(imgs)) {
                for (let img of imgs) {
                    fP = img.path;
                    fS = fP.split('\\');
                    fN = fS[3];
                    e = fN.split('\.');
                    fE = e[3];
                    if (isImg(e))
                        fs.unlinkSync(fP);
                    names.push(fN);
                }
            } else {
                fP = imgs.path;
                fS = fP.split('\\');
                fN = fS[3];
                e = fN.split('\.');
                fE = e[3];
                if (isImg(e))
                    fs.unlinkSync(fP);
                names.push(fN);
            }
            await Recycler.updateOne({ _id: reciclerId }, { photos: names });
            return res.send({ message: `Photos added successfully` });
        } else {
            if (Array.isArray(imgs)) {
                for (let img of imgs) {
                    const fp = img.path;
                    fs.unlinkSync(fp);
                }
            } else {
                const fp = imgs.path;
                fs.unlinkSync(fp);
            }
            return res.status(404).send({ message: `Recycler not found` });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error uploading imgs` });
    }
}

exports.editRecycler = async (req, res) => {
    try {
        /*Obtener los datos a modificar y los id de user y recycler */
        let userLogged = req.user
        let idRecycler = req.params.id
        let data = req.body
        let recycler = await Recycler.findOne({_id: idRecycler})
        if(userLogged.sub != idRecycler && userLogged.role != 'MASTER') 
        return res.status(418).send({message: 'User with not accsses to update recycler'})
        /*verificar que no venga user y que no tenga email repetido*/
        if (data.user != undefined){
            data.user = undefined
        }
        if(data.email != recycler.email ){
            let emailExist = await Recycler.findOne({email: data.email})
            if(emailExist) return res.status(418).send({message: 'That email is already taked in another recycler'})
        }
        /*Actualizar */
        let recyclerUpdated = await Recycler.findOneAndUpdate(
            { _id: idRecycler },
            data,
            { new: true }
        )
        if (!recyclerUpdated) return res.status(404).send({ message: 'Recycler not found' })
        return res.send({ recycler: recyclerUpdated })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error setting Recycler' })
    }
}

exports.deleteRecycler = async (req, res) => {
    try {
        /*Obtener lo valores */
        let userLogged = req.user
        let idRecycler = req.params.id
        console.log(userLogged.role);
        /*validar rol y eliminar */
        if (userLogged.role === 'MASTER') {
            const recyclerMDeleted = await Recycler.findOneAndDelete({ _id: idRecycler })
            if (!recyclerMDeleted) return res.status(404).send({ message: 'Recycler not found and not delete' })
            return res.send({ message: 'Recycler deleted successfully:', recyclerMDeleted })
        } else {
            const recyclerRDeleted = await Recycler.findOneAndDelete({ _id: idRecycler, user: userLogged.sub })
            if (!recyclerRDeleted) return res.status(404).send({ message: 'Recycler not found and not delete' })
            return res.send({ message: 'Recycler deleted successfully:', recyclerRDeleted })
        }
        
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting Recycler' })
    }
}

/* ----- GET USER ----- */
exports.getByUser = async (req, res) => {
    try {
        let user = req.params.user

        let recycler = await Recycler.findOne({ user: user })
        if (!recycler) return res.status(404).send({ message: 'Recycler not found :(' })

        return res.send({ message: 'Recycler found!', recycler })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting user :(', error: err })
    }
}
