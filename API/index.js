'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/red_social',{useMongoClient: true})
    .then(() => {
        console.log("La conexion a la Base de Datos se ha realizado correctamente...")
        
        //CREAR SERVIDOR
        app.listen(port,() => {
            console.log("Servidor corriendo en http://localhost:3800");
        });
    })
    .catch(err => console.log(err));
