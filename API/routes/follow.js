'use strict'

var express = require('express');
var FollowController = require('../controllers/follow');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/follow',md_auth.ensureAuth,FollowController.saveFollow);

module.exports = api;