// Configuración del puerto y de la base de datos
const config = {
    port: 3800,
    connexion: 'mongodb://localhost:27017/cursonode_db',
    host: 'http://localhost:3800/'
}

module.exports = config; // Se exporta la variable config para poder ser usada por otros archivos