'use strict'
var ModeloCurso = require('../modelos/curso');

function crearCurso(req, res) {
    var params = req.body; // Se utiliza cuando los datos se envían tal cual nosotros los pedimos
    var curso = new ModeloCurso(params)

    curso.save((err, cursoRegistrado) => {
        if(err) res.status(500).send({mensaje: 'Error al crear el curso', status: false, err: String(err)});
        res.status(200).send({ModeloCurso: cursoRegistrado, status: true});
    });
}

module.exports = {
    crearCurso
}