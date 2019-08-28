'use strict'

var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

var jwt = require('../services/jwt');
var User = require('../models/user');


function home(req,res){
    res.status(200).send({
        message: 'Hola Mundo desde el Servidor de NodeJS!' 
    });
}      


function pruebas(req,res){
    res.status(200).send({
        message: 'Accion de pruebas en el Servidor de NodeJS' 
    });
}

// REGISTER 

function saveUser(req,res){
    var params = req.body;
    var user = new User();

    if(params.name && params.surname && params.nick && params.email && params.password){

        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;
        
        // CONTROLANDO USUARIOS DUPLICADOS.

        User.find({$or:[
            {email: user.email.toLowerCase()},
            {nick: user.nick.toLowerCase()}
        ]}).exec((err,users) => {
            if(err) return res.status(500).send({message: 'Error en la peticion de usuarios'});
            if(users && users.length >= 1){
                return res.status(200).send({message: 'Usuario existente.'})
            }
            else{

                // CIFRA (ENCRIPTA) LA PASSWORD Y ME GUARDA LOS DATOS.

                bcrypt.hash(params.password, null, null, (err,hash) => {
                    user.password = hash;
                    
                    user.save( (err,userStored) => {
                        if(err) return res.status(500).send({message: 'Error al guardar el usuario'});
                        if(userStored){
                            res.status(200).send({user:userStored});
                        }
                        else{
                            res.status(404).send({message: 'No se ha registrado el usuario.'});
                        }
                    });
                });
            } 
        });
    }
    else{
        res.status(200).send({
            message: 'Complete todos los campos.'
        });
    }
}

// LOGIN 

function loginUser(req,res){
    var params = req.body;
    
    var email = params.email;
    var password = params.password;

    User.findOne({email: email},(err,user)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion.'});
        if(user){
            bcrypt.compare(password, user.password, (err,check) => {
                if(check){
                    //DEVOLVER DATOS DE USUARIO.

                    if(params.gettoken){
                        //GENERAR Y DEVOLVER EL TOKEN.
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    }
                    else{
                        //DEVOLVER DATOS DE USUARIO.
                        user.password = undefined;
                        return res.status(200).send({user})
                    }
                }
                else{
                    return res.status(404).send({message: 'Usuario o contraseña incorrecta.'})
                }
            })
        }
        else{
            return res.status(404).send({message: 'Usuario o contraseña incorrecta...'})
        }
    });
}

// OBTENER DATOS DE UN USUARIO

function getUser(req,res){
    var userId = req.params.id;

    User.findById(userId,(err,user) => {
        if(err) return res.status(500).send({message: 'Error en la peticion.'});
        if(!user) return res.status(404).send({message: 'Usuario inexistente.'});

        return res.status(200).send({user});
    })
}

// DEVOLVER UN LISTADO DE USUARIOS PAGINADO

function getUsers(req,res){
    var identity_user_id = req.user.sub;

    var page = 1;
    var itemsPerPage = 5;
    
    if(req.params.page){
        page = req.params.page;
    }

    User.find().sort('_id').paginate(page,itemsPerPage,(err,users,total)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion.'});
        if(!users) return res.status(404).send({message:'No hay usuarios disponibles.'});
        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total/itemsPerPage)

        });
    });
}

// EDITAR DATOS DE USUARIO

function updateUser(req,res){
    var userId = req.params.id;
    var update = req.body;
    
    //BORRAR LA PROPIEDAD PASSWORD.
    delete update.password;

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario.'});
    }
    User.findByIdAndUpdate(userId,update,{new:true},(err,userUpdated)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion.'});
        if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
        return res.status(200).send({user: userUpdated});
    });
}

// SUBIR IMAGEN PARA EL USUARIO.

function uploadImage(req,res){
    var userId = req.params.id;

    if(req.files){
        var file_path = req.files.image.path; 
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(userId != req.user.sub){
            return removeFilesOfUploads(res,file_path,'No tienes permiso para actualizar los datos del usuario.');
        }
        
        if(file_ext == 'jpg' || file_ext == 'png' || file_ext == 'jpeg' || file_ext == 'gif'){
            //SUBIR/ACTUALIZAR IMAGEN.
            User.findByIdAndUpdate(userId,{image: file_name},{new:true},(err,userUpdated)=>{
                if(err) return res.status(500).send({message: 'Error en la peticion.'});
                if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                return res.status(200).send({user: userUpdated});
            });
        }
        else{
            return removeFilesOfUploads(res,file_path,'Extension invalida.');
        }
    }
    else{
        return res.status(200).send({message: 'No se ha cargado correctamente la imagen.'})
    }
}

function removeFilesOfUploads(res,file_path,message){
    fs.unlink(file_path, (err)=>{
        return res.status(200).send({message: message})
    });
}

function getImageFile(req,res){
    var image_file = req.params.imageFile;
    var path_file = './uploads/users/'+image_file;

    fs.exists(path_file,(exists) => {
        if(exists){
            res.sendFile(path.resolve(path_file));
        }
        else{
            res.status(200).send({message: 'Imagen inexistente.'});
        }
    });

}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile
}