'use strict'

var express = require('express');
var PublicationController = require('../controllers/publication');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multiPart = require('connect-multiparty');
var md_upload = multiPart({uploadDir: './uploads/publications'});

api.get('/probando',md_auth.ensureAuth,PublicationController.probando);

module.exports = api;
