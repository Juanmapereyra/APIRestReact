'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

const article = require('../models/article');
var Article = require('../models/article');
const { param } = require('../routes/article');
const { exists } = require('../models/article');

var controller = {

    datosCurso: (req, res) => {
        var hola = req.body.hola;

        return res.status(200).send({
            curso: 'Master en Frameworks JS',
            autor: 'Juan Manuel Pereyra',
            url:'juanmanupe.com',
            hola
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la acción test de mi controlador de articulos'
        });
    },

    save: (req, res) => {
        // Recoger parametros por post
        var params = req.body;

        // Validar datos (validator)
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar!!'
            });
        }

        if(validate_title && validate_content){
            

        

        // Crear el objeto a guardar 
        var article = new Article();

        // Asignar valores
        article.title = params.title;
        article.content = params.content;
        article.image = null;


        // Guardar el articulo
        article.save((err, articleStore) => {

            if(err || !articleStore){
                return res.status(404).send({
                    status: 'error',
                    message: "El articulo no se ha guardado!!!"
                });
            }
            // Devolver una respuesta
            return res.status(200).send({
                status: 'success',
                article: articleStore
            });

        });

        }else{
            return res.status(200).send({
                status: 'error',
                message: "Los datos no son validos!!"
            });
        }
    },

    getArticles: (req, res) => {

        var query = Article.find({});

        var last = req.params.last;
        if(last || last != undefined){
            query.limit(5);
        }

        // Find
        query.sort('-_id').exec((err, articles) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: "Error al devolver los articulos!!"
                });
            }

            if(err){
                return res.status(404).send({
                    status: 'error',
                    message: "No hay articulos para mostrar!!"
                });

            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        });

    },

    getArticle: (req, res) => {

        // Recoger el id de la url
        var articleId = req.params.id;

        // Comprobar que existe
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                message: "No existe el articulo"
            });
        }

        // Buscar el articulo
        Article.findById(articleId, (err, article) => {

            if(err || !article){
                return res.status(404).send({
                    status: 'error',
                    message: "No existe el articulo"
                });
            }

            // Devolver el json
            return res.status(200).send({
                status: 'success',
                article
            });
        });
    },

    // Metodo para actualizar
    update: (req, res) => {
        // Recoger el id del articulo por la url
        var articleId = req.params.id;

        // Recoger los datos que llegan por put
        var params = req.body;

        // Validar los datos
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: "Faltan datos por enviar!!!"
            });
        }

        if(validate_title && validate_content){
            // Find and update
            Article.findOneAndUpdate({_id: articleId}, params, {new:true}, (err, articleUpdate) => {
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: "Error al actualizar!!!"
                });
                }

                if(!articleUpdate){
                    return res.status(404).send({
                        status: 'error',
                        message: "No existe el articulo!!!"
                });
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdate
                });
            });
        }else{
            // Devolver respuesta
            return res.status(200).send({
                status: 'error',
                message: "La validacion no es correcta!!!"
        });
        }
    },

    // Borrar 

    delete: (req, res) => {
        // Recoger el id de la url
        var articleId = req.params.id;

        // Find and delete
        Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: "Error al borrar !!!"
                });
            }

            if(!articleRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: "No se ha borrado el articulo, posiblemente no exista !!!"
                });
            }

            return res.status(200).send({
                status: "success",
                article: articleRemoved
            });

        });
    },

    upload: (req, res) => {
        // Configurar el modulo connect multiparty en router/article.js (hecho en article.js)

        // Recoger el fichero de la petición
        var file_name = 'Imagen no subida...'

        if(!req.files){
            return req.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        // Conseguir el nombre y la extensión del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        // Nombre del archivo
        var file_name = file_split[2];

        // Extensión del fichero
        var extension_split =  file_name.split('\.');
        var file_ext = extension_split[1];

        // Comprobar la extensión, solo imagenes, si no es valida borrar el fichero
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            // Borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extension de la imagen no es valida'
                });
            });
        }else{
            // Si todo es valido, sacando el id de la url

            var articleId = req.params.id;

            // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo

            Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true},(err, articleUpdate) => {

                if(err || !articleUpdate){
                    return res.status(200).send({
                        status: 'error',
                        message: 'Error al guardar la imagen del articulo'
                    });
                }

                return res.status(200).send({
                    status: 'Success',
                    article: articleUpdate
                });

            });
        }
    }, // end upload file

    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/articles/'+file;

        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe !!!'
                });
            }
        });
    },

    search: (req, res) => {
        // Sacar el string a buscar
        var searchString = req.params.search;

        // Find or 
        Article.find({ "$or": [

            {"title": { "$regex": searchString, "$options": "i" }},
            {"content": { "$regex": searchString, "$options": "i" }}

        ]})
        .sort([['date', 'descending']])
        .exec((err, articles) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                });
            }

            if(!articles || articles.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos que coincidan con tu busqueda'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });

        });
        
    }

}; // end of controller

module.exports = controller;