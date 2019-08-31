'use strict'

var express = require('express');
var PublicationController = require('../controllers/publication');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multiPart = require('connect-multiparty');
var md_upload = multiPart({uploadDir: './uploads/publications'});

api.get('/probando',md_auth.ensureAuth,PublicationController.probando);
api.get('/publications/:page?',md_auth.ensureAuth,PublicationController.getPublications);
api.get('/publication/:id',md_auth.ensureAuth,PublicationController.getPublication);
api.get('/get-image-pub/:imageFile',PublicationController.getImageFile);

api.post('/publication',md_auth.ensureAuth,PublicationController.savePublication);
api.post('/upload-image-pub/:id',[md_auth.ensureAuth,md_upload],PublicationController.uploadImage);

api.delete('/publication/:id',md_auth.ensureAuth,PublicationController.deletePublication);

module.exports = api;
