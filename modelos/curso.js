'use strict'
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CursoSchema = new Schema ({
    nombre: {type: String, minlength: 4, required: true},
    temario_file: {type: String},
    temario: {type: Object, required: true},
    video_introduccion: {type: String},
    sumary: {type: String, required: true},
    docente: {type: Schema.ObjectId, ref: 'docentes', required: true},    //ref hace referencia al modelo de docentes, al cual nombramos docentes cuando lo exportamos
    fecha_inicio: Date,
    fecha_final: Date,
    status: {type: Number, enum: [1,2,3,4,5]}, // El enum hace que sólo se acepte lo que se encuentra en el array, si se pone otro valor marca un error
    hora: {type: String, required: true},
    duracion: {type: Number, required: true}, // Horas que dura el curso 
    valoracion: {
        rating: {type: Number, default: 0},
        listRating: [Number]
    },
    habilidadesDesarrolladas: [String],
    precio: {type: Number, default: 0},
    cupoLimite: {type: Number, required: true},
    imagen: {type: String,default: null},
    registrados: [{type: Schema.ObjectId, ref: 'estudiantes'}],
    descripcion: {type: String, required: true},
    requisitos: [{type: String, default: 'Sin requisitos'}],
    ubicacion: String
})
/*
1.- Inscripciones abiertas
2.- Activo (ya empezó el curso)
3.- Cupo agotado
4.- Finalizado
5.- Pendiente
*/


module.exports = mongoose.model('cursos', CursoSchema); 