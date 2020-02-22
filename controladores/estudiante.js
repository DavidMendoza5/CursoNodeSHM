'use strict'
var ModelEstudiante = require('../modelos/estudiante');
var ModelCurso = require('../modelos/curso');
var bcrypt = require('bcrypt-nodejs');
var servicios = require('../servicios/datos');

function crearEstudiante(req, res) {
    var params = req.body;
    var Estudiante = new ModelEstudiante(params);

    // Verificar duplicado
    ModelEstudiante.find({$and:[{correo:params.correo},{curso: params.curso}]}, (err, verificarDuplicado) => {
        if(err) return res.status(500).send({message: 'Error al crear estudiante', status: false, err: String(err)})

        if(verificarDuplicado && verificarDuplicado.length > 0) {
            res.status(200).send({message: 'Ya está inscrito al curso', status: false})
        }
        bcrypt.hash(params.correo + params.curso, null, null, (err, hash) => {
            if(err) return res.status(500).send({message: 'Error al crear estudiante', status: false, err: String(err)})
            Estudiante.token_calificacion = hash;
            Estudiante.status_calificacion = true;
            Estudiante.save(async (err, estudianteRegistrado) => {
                if(err) res.status(500).send({message: 'Error al crear estudiante', status: false, err: String(err)})
                // Actualizar status, agregar registrados
                console.log(params, String('hhhhhhhhhhhhhhh'))
                await servicios.actualizarRegistros(params.curso, estudianteRegistrado);
                res.status(200).send({Estudiante: estudianteRegistrado, status: true})
            })
        });
    })
}

module.exports = {
    crearEstudiante
}