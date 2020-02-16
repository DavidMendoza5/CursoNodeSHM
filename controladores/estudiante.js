'use strict'
var ModelEstudiante = require('../modelos/estudiante');

function crearEstudiante(req, res) {
    var params = req.body;
    var Estudiante = new ModelEstudiante();

    Estudiante.nombre = params.nombre;
    Estudiante.cargo = params.cargo;
    Estudiante.correo = params.correo;
    Estudiante.telefono = params.telefono;
    Estudiante.conocimientos_previos = params.conocimientos_previos;


    ModelEstudiante.find({correo: params.correo}, (err, duplicado) => {
        if(err) res.status(500).send({mensaje: err, status: false});
        if(duplicado && duplicado.length >= 1) {
            res.status(500).send({mensaje: 'Estudiante existente', status: false});
        } else {
            Estudiante.save((err, EstudianteRegistrado) => {
                if(err) res.status(500).send({mensaje: 'Error al insertar estudiante', status: false});
                    res.status(200).send({estudiante: EstudianteRegistrado, status: true});
            })
        }
    }) 
}

module.exports = {
    crearEstudiante
}