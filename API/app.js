'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// CARGAR RUTAS.

var user_routes = require('./routes/user');

// MIDDLEWARES --> METODO QUE SE EJECUTA ANTES DE QUE LLEGUE A UN CONTROLADOR.

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

// CORS

// RUTAS

app.use('/api', user_routes);

//EXPORTAR CONFIGURACIONES

module.exports = app;