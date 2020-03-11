'use strict'
var ModelDocente = require('../modelos/docente');
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var servicios = require('../servicios/jwt');
var ModelCursos = require('../modelos/curso');
var ModelEstudiantes = require('../modelos/estudiante');
var ModelComentarios = require('../modelos/comentario');

// Cuando enviamos por POST es body y cuando es un GET es por params
/*
function home(req, res) {
    res.status(200).send({mensaje: 'Hola mundo'})
};

function insert(req, res) {
    console.log(req.body)
    res.status(200).send({mensaje: 'Datos enviados correctamente'})
};
*/

function crearDocente(req, res) {
    var params = req.body;
    var Docente = new ModelDocente();

    Docente.nombre = params.nombre;
    Docente.cargo = params.cargo;
    Docente.resumen = params.resumen;
    Docente.total_estudiantes = 0;
    Docente.imagen_perfil = params.imagen_perfil;
    Docente.correo = params.correo;
    Docente.password = params.password;
    Docente.redes_sociales.facebook = params.facebook;
    Docente.redes_sociales.twitter = params.twitter;
    Docente.redes_sociales.youtube = params.youtube;
    Docente.redes_sociales.linkedin = params.linkedin;

// Validar si el correo del docente ya existe
    ModelDocente.find({correo: params.correo}, (err, duplicado) => {
        if(err) res.status(500).send({mensaje: err, status: false});
        if(duplicado && duplicado.length >= 1) {
            res.status(500).send({mensaje: 'Docente existente', status: false});
        } else {
            bcrypt.hash(params.password, null, null, (err, hash) => {
                if(err) res.status(500).send({mensaje: 'Error al encriptar la contraseña', status: false});
                Docente.password = hash;
                Docente.save((err, docenteRegistrado) => {
                    if(err) res.status(500).send({mensaje: 'Error al insertar docente', status: false});
                    res.status(200).send({docente: docenteRegistrado, status: true});
                });
            })
        }
    })
}

function obtenerDocente(req, res) {
    var params = req.params;
    console.log(params);
    ModelDocente.find({_id:params.id}, {password:0}, (err, docente) => { // El primer id significa WHERE id == id (el de params), el segundo parámetro en las llaves es para mostrar (1) o no mostrar el dato(0)
        if(err) res.status(500).send({message: 'Error', status: false});
        res.status(200).send(docente);
    })
}

function obtenerDocentes(req, res) {
    var params = req.params;
    var page = 1;
    if(params.page) {
        page = parseInt(params.page);
    }
    
    var itemPerPage = 2;
    if(params.itemPerPage) {
        itemPerPage = parseInt(params.itemPerPage);
    }

    ModelDocente.find({}, {password:0}).paginate(page, itemPerPage, (err, docentes, total) => {
        console.log(docentes);
        if(err) res.status(500).send({message: 'Error', status: false});
        res.status(200).send({
            docentes,
            total,
            page,
            itemPerPage,
            pages: Math.ceil(total/itemPerPage)
        })
    })
}

function login(req, res) {
    var params = req.body;
    var p_password = params.password;
    var p_correo = params.correo;

    // Buscar al docente
    ModelDocente.findOne({correo: p_correo}, (err, docente) => {
        if(err) res.status(500).send({message: 'Error', status: false});
        if(docente) {
            bcrypt.compare(p_password, docente.password, (err, verificado) => {
                // Crear token de validación
                if(err) res.status(500).send({message: 'Las credenciales no coinciden', status: false});
                if(verificado) {
                    docente.password = undefined;
                    var token = servicios.auth(docente);
                    return res.status(200).send({docente, token})
                } else { 
                    res.status(404).send({message: 'Las credenciales no coinciden', status: false});
                }
    
                
            })
        } else {
            res.status(404).send({message: 'Credenciales inválidas', status: false});
        }
    })
}

function actualizarDocente(req, res) {
    var docenteId = req.params.id;
    var update = req.body;

    if(docenteId != req.docente.sub){
        if(err) res.status(500).send({message: 'No tienes permisos', status: false});
    }

    ModelDocente.findOneAndUpdate({_id: docenteId}, update, {new:true}, (err, docenteActualizado) => { // El new:true sobreescribe sólo el dato que se envió
        if(err) res.status(500).send({message: 'Error', status: false});
        
        res.status(200).send({docenteActualizado, status: true});
        })
    }

async function eliminarDocente(req,res){ // Necesitamos eliminar todo lo que tenga el docente debido a que mongo no hace la eliminación cascada y deja residuos
    var params = req.params.id
    
    //await ModelDocente.remove({_id: params});
    //await ModelComentarios.remove({receptor_docente: params});
    await ModelDocente.deleteOne({_id: params});
    await ModelComentarios.deleteOne({receptor_docente: params});
    //await ModelCursos.deleteOne({docente: params});
    await ModelCursos.deleteMany({docente: params}); // Una opción sería intentar pasarle otro objeto que contenga $in:registrados
     /*var Cursos = await ModelCursos.distinct('_id', {docente: params}); // EL distinc nos sirve para traer un arreglo del parámetro solicitado
     Cursos.forEach((curso) => {
         ModelCursos.remove({_id: curso.id});
         ModelEstudiantes.remove({$in: curso.registrados});
     });*/
    
    res.status(200).send({message: 'Docente eliminado'})
 }
module.exports = {
    //home,
    //insert,
    crearDocente,
    obtenerDocente,
    obtenerDocentes,
    actualizarDocente,
    eliminarDocente,
    login,
    eliminarDocente
}