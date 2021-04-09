'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
//api_rest_blog es el nombre de la base de datos que vamos a crear
mongoose.connect('mongodb://localhost:27017/api_rest_blog', { useNewUrlParser: true })
    .then(() => {
        console.log('La conexion se ha realizado bien!!!');

        // Creacion del servidor y ponerme a escuchar peticiones HTTP
        app.listen(port, () =>{
            console.log('Servidor corriendo en http://localhost:'+port);
        });
});