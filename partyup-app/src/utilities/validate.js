const { ValueError } = require('../errors')

function validateLogic(params) {
    params.forEach(({ key, value, type, optional }) => {
        switch (type) {
            case String:
                if (optional && value == null) break

                if (typeof value !== 'string') throw TypeError(`${value} is not a string`)

                if (!value.trim().length) throw new Error(`${key} is empty or blank`)

                break
            case Boolean:
                if (optional && value == null) break

                if (typeof value !== 'boolean') throw TypeError(`${value} is not a boolean`)

                break
            case Number:
                if (optional && value == null) break

                if (typeof value !== 'number') throw TypeError(`${value} is not a number`)
                break
            case Date:
                if (optional && value === null) break

                if (!(value instanceof Date)) throw TypeError(`${value} is not a Date`)
        }
    })
}
//RUN APP
export default validateLogic
//RUN TEST
// module.exports = validateLogic