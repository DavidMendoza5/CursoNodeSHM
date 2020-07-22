const ModelDocente = require('../../modelos/docente');

function findDocente(filtros, validarDuplicados)  {    // { correo: params.correo }
    ModelDocente.find(filtros, validarDuplicados)
} 

module.exports = findDocente