'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// CARGAR RUTAS.

// MIDDLEWARES --> METODO QUE SE EJECUTA ANTES DE QUE LLEGUE A UN CONTROLADOR.

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

// CORS

// RUTAS

app.get('/', (req,res) => {
    res.status(200).send({
        message: 'Hola Mundo desde el Servidor de NodeJS!' 
    });
});      


app.get('/pruebas', (req,res) => {
    res.status(200).send({
        message: 'Accion de pruebas en el Servidor de NodeJS' 
    });
});      

//EXPORTAR CONFIGURACIONES

module.exports = app;