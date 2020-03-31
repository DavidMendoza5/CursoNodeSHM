'use strict'
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ComentariosSchema = new Schema({
    descripcion: { type: String },
    tipo: { type: String, enum: ['curso', 'docente', 'Curso', 'Docente'] },
    estudiante: { type: Schema.ObjectId, ref: 'estudiantes' },
    receptor_docente: { type: Schema.ObjectId, ref: 'docentes' },
    receptor_curso: { type: Schema.ObjectId, ref: 'cursos' },
    calificacion: { type: Number, max: [10, 'Fuera de rango'] } // Los corchetes nos permiten poner mensajes de error
})

module.exports = mongoose.model('comentarios', ComentariosSchema);