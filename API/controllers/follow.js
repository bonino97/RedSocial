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

module.exports = {
    saveFollow
}