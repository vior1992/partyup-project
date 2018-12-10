const AlreadyExistsError = require('./already-exists-error')
const AuthError = require('./auth-error')
const NotFoundError = require('./not-found-error')
const ValueError = require('./value-error')

//RUN APP
export default {
    AlreadyExistsError,
    AuthError,
    NotFoundError,
    ValueError
}

// RUN TEST
// module.exports = {
//     AlreadyExistsError,
//     AuthError,
//     NotFoundError,
//     ValueError
// }