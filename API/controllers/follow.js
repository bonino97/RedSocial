'use strict'

//var fs = require('fs');
//var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');

function saveFollow(req,res){
    var params = req.body;

    var follow = new Follow();
    follow.user = req.user.sub;
    follow.followed = params.followed;

    follow.save((err,followStored)=>{
        if(err) return res.status(500).send({message: 'No puedes seguir a este usuario.'});
        if(!followStored) return res.status(404).send({message: 'Seguimiento no guardado.'});
        return res.status(200).send({follow:followStored});
    });
}

function deleteFollow(req,res){
    var userId = req.user.sub;
    var followId = req.params.id;

    Follow.findOneAndRemove({'user':userId, 'followed': followId},err => {
        if(err) return res.status(500).send({message: 'Error al dejar de seguir este usuario.'});
        return res.status(200).send({message: 'Has dejado de seguir a este usuario.'});
    });

}

//SIGUIENDO -- PAGINADOS

function getFollowingUsers(req,res){
    var userId = req.user.sub;
    if(req.params.id && req.params.page){
        userId = req.params.id;
    }

    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    else{
        page = req.params.id;
    }    

    var itemsPerPage = 4;

    Follow.find({user:userId}).populate({path:'followed'}).paginate(page,itemsPerPage,(err,follows,total)=>{
        if(err) return res.status(500).send({message: 'Error en el servidor.'});
        if(!follows) return res.status(404).send({message: 'No sigues a ningun usuario.'});
        
        followUserIds(req.user.sub).then((value)=>{
            return res.status(200).send({
                total:total,
                pages: Math.ceil(total/itemsPerPage),
                follows,
                users_following: value.following,
                users_follow_me: value.followed
            });
        });
    });
}

async function followUserIds(user_id) {

    var following = await Follow.find({ user: user_id }).select({ _id: 0, __v: 0, user: 0 })
        .exec()
        .then((follows) => {
            var follows_clean = [];

            follows.forEach((follow) => {
                follows_clean.push(follow.followed);
            });
            return follows_clean;
        })
        .catch((err) => {
            return handleError(err);
        });

    var followed = await Follow.find({ followed: user_id }).select({ _id: 0, __v: 0, followed: 0 })
        .exec()
        .then((follows) => {
            var follows_clean = [];
            follows.forEach((follow) => {
                follows_clean.push(follow.user);
            });

            return follows_clean;
        })
        .catch((err) => {
            return handleError(err);
        });

    return {
        following: following,
        followed: followed
    };
}

//SEGUIDOS -- PAGINADOS

function getFollowedUsers(req,res){
    var userId = req.user.sub;
    if(req.params.id && req.params.page){
        userId = req.params.id;
    }

    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    else{
        page = req.params.id;
    }    

    var itemsPerPage = 4;

    Follow.find({followed:userId}).populate('user followed').paginate(page,itemsPerPage,(err,follows,total)=>{
        if(err) return res.status(500).send({message: 'Error en el servidor.'});
        if(!follows) return res.status(404).send({message: 'No tienes seguidores.'});
        followUserIds(req.user.sub).then((value)=>{
            return res.status(200).send({
                total:total,
                pages: Math.ceil(total/itemsPerPage),
                follows,
                users_following: value.following,
                users_follow_me: value.followed
            });
        });
    });
}

//DEVOLVER USUARIOS QUE SIGO O ME SIGUEN.
/*SIN PARAMETRO (SOLO TOKEN) LISTA LOS USUARIOS QUE SIGO.
  SI COMO PARAMETRO LE PASO TRUE LISTA LOS USUARIOS QUE ME SIGUEN. 
  (FALTA ANALIZAR UN POCO MAS - TODAVIA NO TERMINO DE COMPRENDER LA LOGICA.) -- VIDEO 34 */

function getMyFollows(req,res){
    var userId = req.user.sub;
    var find = Follow.find({user:userId});

    if(req.params.followed){
        find = Follow.find({followed:userId});
    }
 
    find.populate('user followed').exec((err,follows) => {
        if(err) return res.status(500).send({message: 'Error en el servidor.'});
        if(!follows) return res.status(404).send({message: 'No sigues a ningun usuario.'});
        return res.status(200).send({follows});
    });
}

module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows
}