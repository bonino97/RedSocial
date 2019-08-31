'use strict'

var express = require('express');
var MessageControler = require('../controllers/message');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/probando-md',md_auth.ensureAuth,MessageControler.probando);
api.get('/my-messages/:page?',md_auth.ensureAuth,MessageControler.getReceivedMessages);
api.get('/messages/:page?',md_auth.ensureAuth,MessageControler.getEmittedMessages);
api.get('/unviewed-messages',md_auth.ensureAuth,MessageControler.getUnviewedMessages);
api.get('/set-viewed-messages',md_auth.ensureAuth,MessageControler.setViewedMessages);

api.post('/message',md_auth.ensureAuth,MessageControler.saveMessage);


module.exports = api;