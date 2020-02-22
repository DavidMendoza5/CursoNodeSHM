'use strict'
var ModeloCurso = require('../modelos/curso');
var ModeloEstudiante = require('../modelos/estudiante');
var ModeloDocente = require('../modelos/docente');

async function actualizarRegistros(cursoId, estudiante) {
    let update_docentes = {};
    let update_curso = {};

    const curso = await ModeloCurso.findById({_id: cursoId})
    console.log(curso);
    if(curso['cupoLimite'] == 0) {
        update_curso = {$set: {cupoLimite: 0, status: 3}} // Set es para cambiar un valor directamente
    } else {
        update_curso = {$inc: {cupoLimite: -1},
                        $push: {registrados: estudiante._id}
                    }

        update_docentes = {$inc: {total_estudiantes: 1}}
        // Send email

        await  ModeloDocente.findByIdAndUpdate({_id: curso.docente}, update_docentes, {upsert: true});
    }
    await ModeloCurso.findByIdAndUpdate({_id: cursoId}, update_curso, {upsert: true});
}

module.exports = {
    actualizarRegistros
}