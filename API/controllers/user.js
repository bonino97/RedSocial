'use strict'

var bcrypt = require('bcrypt-nodejs');
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

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser
}