'use strict'
var ModeloCurso = require('../modelos/curso');
var fs = require('fs');
var path = require('path');
var config = require('../configuracion/config');

function crearCurso(req, res) {
    var params = req.body; // Se utiliza cuando los datos se envían tal cual nosotros los pedimos
    var curso = new ModeloCurso(params)
    curso.docente = req.docente.sub;

    curso.save((err, cursoRegistrado) => {
        if(err) res.status(500).send({mensaje: 'Error al crear el curso', status: false, err: String(err)});
        res.status(200).send({ModeloCurso: cursoRegistrado, status: true});
    });
}

function obtenerCursoDisponible(req, res) {
    var params = req.params;
    var page = 1;
    if(params.page) {
        page = parseInt(params.page);
    }
    
    var itemPerPage = 2;
    if(params.itemPerPage) {
        itemPerPage = parseInt(params.itemPerPage);
    }

    ModeloCurso.find({status: {$ne: 5}}).paginate(page, itemPerPage, (err, cursos, total) => { // ne Significa que traiga todos los cursos que no sean 5
        console.log(cursos);
        if(err) res.status(500).send({message: 'Error', status: false});
        res.status(200).send({
            cursos,
            total,
            page,
            itemPerPage,
            pages: Math.ceil(total/itemPerPage)
        })
    })
}

function obtenerCurso(req, res) {
    var params = req.params;
    console.log(params);
    ModeloCurso.find({_id:params.id}). // El nombre del path debe ser el que se puso en el modelo de cursos
    populate({path: 'registrados'}).
    populate({path: 'docente', select: 'nombre, correo'}).exec((err, cursos) => { // El populate sirve para crear la relación con los docentes, el select sirve para traer sólo esos datos, si no se pone trae todos los datos
        console.log(cursos);
        if(err) res.status(500).send({message: 'Error', status: false});
        res.status(200).send(cursos);
    })
}

function subirImagen(req, res) {
    console.log(req.files);
    var cursoID = req.params.id;

    if(req.files) {
        var direccionArchivo = req.files.archivo.path;
        var extension = req.files.archivo.name.split('.')[1]
        var nombreArchivo = cursoID + '.' + extension;
        // Old path
        const old_path = path.join(__dirname, '../', direccionArchivo);
        console.log(old_path);
        const new_path = path.join(__dirname, '../imagenes/', nombreArchivo);
        console.log(new_path);
        fs.renameSync(old_path, new_path);

        if(extension == 'png' || extension == 'jpg' || extension == 'jpeg') {
            ModeloCurso.findByIdAndUpdate({_id:cursoID}, {image: config.host + '/imagenes/' + nombreArchivo}, (err, imagenActualizada) => {
                if(err) return res.status(500).send({message: 'La imagen no pude ser actualizada', status: false});
                res.status(200).send({message: imagenActualizada, status: true});
            })
        } else {
            fs.unlink(new_path, (err) => { // Sirve para eliminar el archivo si no tiene la extensión requerida
                res.status(200).send({message: 'El archivo no tiene la extensión requerida', status: false});
            })
        }
    } else {
        res.status(200).send({message: 'El archivo es requerido', status: false});
    }
}

function actualizarCurso(req, res) {
    var cursoId = req.params.id;
    var update = req.body;

    ModeloCurso.findOneAndUpdate({_id: cursoId}, update, {new:true}, (err, cursoActualizado) => { // El new:true sobreescribe sólo el dato que se envió
        if(err) res.status(500).send({message: 'Error', status: false});
        
        res.status(200).send({cursoActualizado, status: true});
        })
    }

module.exports = {
    crearCurso,
    obtenerCursoDisponible,
    obtenerCurso,
    subirImagen,
    actualizarCurso
}