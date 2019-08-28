'use strict'

var express = require('express');
var multiParty = require('connect-multiparty');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var md_upload = multiParty({uploadDir:'./uploads/users'});

api.get('/home', UserController.home);
api.get('/pruebas',md_auth.ensureAuth, UserController.pruebas);
api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);
api.get('/user/:id',md_auth.ensureAuth,UserController.getUser);
api.get('/users/:page?',md_auth.ensureAuth,UserController.getUsers);
api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser);
api.post('/upload-image-user/:id',[md_auth.ensureAuth,md_upload],UserController.uploadImage);
api.get('/get-image-user/:imageFile',UserController.getImageFile);


module.exports = api; 