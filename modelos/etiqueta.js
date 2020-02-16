'use strict'
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EtiquetasSchema = new Schema ({
    etiqueta: {
        type: String, 
        unique: true, 
        lowercase: true, 
        required: [true, 'Etiqueta requerida']
    },
    referenciaId: [{type: String}]
})

module.exports = mongoose.model('etiquetas', EtiquetasSchema);