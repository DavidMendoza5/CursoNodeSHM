const ModelDocente = require('../../modelos/docente');

function crearDocenteEnDB(params, validarRegistro) {
    const Docente = new ModelDocente(params);
    Docente.save(validarRegistro) 
}

module.exports = crearDocenteEnDB