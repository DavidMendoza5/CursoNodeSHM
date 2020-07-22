const bcrypt = require('bcrypt-nodejs')

function encriptar(password, saltRounds) {
        const salt = bcrypt.genSaltSync(saltRounds)
        return bcrypt.hashSync(password, salt)
}

module.exports = encriptar