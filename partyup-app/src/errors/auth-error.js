class AuthError extends Error {
    constructor(message, extra) {
        super()

        Error.captureStackTrace(this, this.constructor)

        this.name = 'AuthError'
        this.message = message

        if (extra) this.extra = extra
    }
}

//RUN APP
export default AuthError
//RUN TEST
// module.exports = AuthError
