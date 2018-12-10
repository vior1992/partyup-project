class ValueError extends Error {
    constructor(message, extra) {
        super()

        Error.captureStackTrace(this, this.constructor)

        this.name = 'ValueError'
        this.message = message

        if (extra) this.extra = extra
    }
}

//RUN APP
export default ValueError
//RUN TEST
// module.exports = ValueError
