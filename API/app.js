'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// CARGAR RUTAS.

var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/publication');
var message_routes = require('./routes/message');

// MIDDLEWARES --> METODO QUE SE EJECUTA ANTES DE QUE LLEGUE A UN CONTROLADOR.

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

// CORS

// RUTAS

app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', publication_routes);
app.use('/api', message_routes);

//EXPORTAR CONFIGURACIONES

module.exports = app;