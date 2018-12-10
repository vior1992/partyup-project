const { models: { User, Partyup, Commentary } } = require('partyup-data')
const validateLogic = require('../utilities/validate')
const { AlreadyExistsError, AuthError, NotFoundError, ValueError } = require('../errors')
const cloudinary = require('cloudinary')
var moment = require('moment');

cloudinary.config({
    cloud_name: 'vior1992',
    api_key: '193425753116639',
    api_secret: 'xCezhtXMWcCFHWY8xB6W1m9feIs'
})

const logic = {

    /**
    * 
    * @param {string} base64Image 
    * 
    * @throws {Error} On not string base64image.
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data.
    */
    _saveImage(base64Image) {
        return Promise.resolve().then(() => {
            if (typeof base64Image !== 'string') throw new TypeError('base64Image is not a string')

            return new Promise((resolve, reject) => {
                return cloudinary.v2.uploader.upload(base64Image, function (err, data) {
                    if (err) return reject(err)

                    resolve(data.url)
                })
            })
        })
    },

    /**
     * 
     * @param {string} name -> The name of the user.
     * @param {string} surname -> The surname of the user.
     * @param {string} city -> The city of the user.
     * @param {string} username -> The username of the user.
     * @param {string} passowrd -> The passowrd of the user.
     * 
     * @throws {TypeError} On not string data.
     * @throws {Error} On empty or blank data.
     * @throws {TypeError} On not boolean data.
     * @throws {TypeError} On not number data.
     * @throws {TypeError} On not date data.
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong data.
     */
    registerUser(name, surname, city, username, password) {
        validateLogic([
            { key: 'name', value: name, type: String },
            { key: 'surname', value: surname, type: String },
            { key: 'city', value: city, type: String },
            { key: 'username', value: username, type: String },
            { key: 'password', value: password, type: String }
        ])

        return (async () => {
            let user = await User.findOne({ username })

            if (user) throw new AlreadyExistsError(`username ${username} already exists`)

            user = new User({ name, surname, city, username, password })

            await user.save()
        })()
    },

    /**
     * 
     * @param {string} username -> The username of the user.
     * @param {string} passowrd -> The passowrd of the user.
     * 
     * @throws {TypeError} On not string data.
     * @throws {Error} On empty or blank data.
     * @throws {TypeError} On not boolean data.
     * @throws {TypeError} On not number data.
     * @throws {TypeError} On not date data.
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong data.
     */
    authenticateUser(username, password) {
        validateLogic([
            { key: 'username', value: username, type: String },
            { key: 'password', value: password, type: String }
        ])

        return (async () => {
            const user = await User.findOne({ username })

            if (!user || user.password !== password) throw new AuthError('Wrong credentials, try again')

            return user.id
        })()
    },

    /**
     * 
     * @param {string} id -> The id of the user.
     * 
     * @throws {TypeError} On not string data.
     * @throws {Error} On empty or blank data.
     * @throws {TypeError} On not boolean data.
     * @throws {TypeError} On not number data.
     * @throws {TypeError} On not date data.
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong data.
     */
    retrieveLoggedUser(id) {
        validateLogic([{ key: 'id', value: id, type: String }])
        return (async () => {
            const user = await User.findById(id, { '_id': 0, password: 0, __v: 0 }).lean()

            if (!user) throw new NotFoundError(`user not found`)

            user.id = id

            return user
        })()
    },

    /**
     * 
     * @param {string} userId -> The id of the user.
     * 
     * @throws {TypeError} On not string data.
     * @throws {Error} On empty or blank data.
     * @throws {TypeError} On not boolean data.
     * @throws {TypeError} On not number data.
     * @throws {TypeError} On not date data.
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong data.
     */
    async searchUserById(userId) {
        validateLogic([{ key: 'userId', value: userId, type: String }])

        const user = await User.findById(userId).lean()

        user.id = userId

        delete user._id

        return user
    },

    /**
     * 
     * @param {string} userId -> The id of the user.
     * @param {string} chunk -> The chunk of picture that has been upload to cloudinary.
     * 
     * @throws {TypeError} On not string data.
     * @throws {Error} On empty or blank data.
     * @throws {TypeError} On not boolean data.
     * @throws {TypeError} On not number data.
     * @throws {TypeError} On not date data.
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong data.
     */
    async addUserAvatar(userId, chunk) {
        validateLogic([
            { key: 'userId', value: userId, type: String },
            { key: 'chunk', value: chunk, type: String }
        ])

        const user = await User.findById(userId)

        if (!user) throw new NotFoundError(`user with id ${userId} not found`)

        const imageCloudinary = await logic._saveImage(chunk)

        user.avatar = imageCloudinary

        return user.save()
    },

    /**
     * 
     * @param {string} userId -> The id of the user.
     * 
     * @throws {TypeError} On not string data.
     * @throws {Error} On empty or blank data.
     * @throws {TypeError} On not boolean data.
     * @throws {TypeError} On not number data.
     * @throws {TypeError} On not date data.
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong data.
     */
    async deleteUser(userId) {
        validateLogic([{ key: 'userId', value: userId, type: String }])

        //DELETE COMMENTARIES OF USER
        const comments = await Commentary.find({ userId: userId })
        if (comments) {
            comments.map(async () => {
                await Commentary.findOneAndDelete({ userId: userId })
            })
        }

        const userPartyups = await Partyup.find({ user: userId })

        //DELETE COMMENTARIES OF USER FROM PARTYUPS
        if (userPartyups)
            userPartyups.forEach(async (partyup) => {
                const comments = await Commentary.find({ partyupId: partyup._id })

                comments.forEach(async (comment) => {
                    await Commentary.findByIdAndDelete(comment._id)
                })
            })

        //DELETE ASSISTENCES OF USER FROM PARTYUPS
        logic.listPartyupsIAssist(userId)
            .then(partyups => {
                partyups.forEach(partyup => {
                    logic.notAssistToPartyup(userId, partyup.id)
                })
            })

        //DELETE ALL PARTYUPS OF USER
        if (userPartyups)
            userPartyups.map(async () => {
                await Partyup.findOneAndDelete({ user: userId })
            })

        //DELETE USER
        const user = await User.findByIdAndDelete(userId)
    },

    /**
     * 
     * @param {string} title -> The title of the partyup.
     * @param {string} description -> The description of the partyup.
     * @param {date} date -> The date of the partyup.
     * @param {string} city -> The city of the partyup.
     * @param {string} place -> The place of the partyup.
     * @param {string} tags -> The tags of the partyup.
     * @param {string} userId -> The userId of the partyup.
     * @param {string} image -> The image of the partyup (Optional).
     * 
     * @throws {TypeError} On not string data.
     * @throws {Error} On empty or blank data.
     * @throws {TypeError} On not boolean data.
     * @throws {TypeError} On not number data.
     * @throws {TypeError} On not date data.
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong data.
     */
    createPartyup(title, description, date, city, place, tags, userId, image) {
        validateLogic([
            { key: 'title', value: title, type: String },
            { key: 'description', value: description, type: String },
            { key: 'date', value: date, type: Date },
            { key: 'city', value: city, type: String },
            { key: 'place', value: place, type: String },
            { key: 'tags', value: tags, type: String },
            { key: 'userId', value: userId, type: String },
            { key: 'image', value: image, type: String, optional: true }
        ])

        const formateDate = moment(date).format('YYYY-MM-DD')
        const formateNowDate = moment().format('YYYY-MM-DD')

        if (!(formateDate >= formateNowDate)) throw new ValueError(`Minimum date must be today`)

        return (async () => {
            const user = await User.findById(userId)

            if (!user) throw new ValueError(`user not found`)

            const assistants = userId

            const partyup = new Partyup({ title, description, date, city, place, tags, assistants, user: user.id })


            if (image) {
                const imageCloudinary = await logic._saveImage(image)
                partyup.picture = imageCloudinary
            }

            await partyup.save()
        })()
    },

    /**
    * 
    * @param {string} image -> The chunk of picture that has been upload to cloudinary.
    * 
    * @throws {TypeError} On not string data.
    * @throws {Error} On empty or blank data.
    * @throws {TypeError} On not boolean data.
    * @throws {TypeError} On not number data.
    * @throws {TypeError} On not date data.
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data.
    */
    async addPartyupPicture(image) {
        validateLogic([{ key: 'image', value: image, type: String }])

        const picture = await this._saveImage(image)

        return picture
    },

    /**
    * 
    * @param {string} partyupId -> The partyupId of the partyup.
    * 
    * @throws {TypeError} On not string data.
    * @throws {Error} On empty or blank data.
    * @throws {TypeError} On not boolean data.
    * @throws {TypeError} On not number data.
    * @throws {TypeError} On not date data.
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data.
    */
    async searchPartyupById(partyupId) {
        validateLogic([{ key: 'partyupId', value: partyupId, type: String }])

        const partyup = await Partyup.findById(partyupId, { '_id': 0, password: 0, __v: 0 }).lean()

        if (!partyup) throw new NotFoundError(`partyup with id ${partyupId} not found`)

        partyup.id = partyupId.toString()

        return partyup
    },

    /**
     * 
     * @param {number} perPage -> The items per page that will be listed
     * @param {number} page -> The pages that will be listed.
     * @param {string} city -> The city of the partyup.
     * @param {string} tags -> The partyupId of the partyup.
     * 
     * @throws {TypeError} On not string data.
     * @throws {Error} On empty or blank data.
     * @throws {TypeError} On not boolean data.
     * @throws {TypeError} On not number data.
     * @throws {TypeError} On not date data.
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong data.
     */
    listPartyups(perPage, page, city, tags) {
        validateLogic([
            { key: 'perPage', value: perPage, type: Number },
            { key: 'page', value: page, type: Number },
        ])

        if (city) validateLogic([{ key: 'city', value: city, type: String }])

        if (tags) validateLogic([{ key: 'tags', value: tags, type: String }])

        return (async () => {
            let find = {

            }

            if (city) find.city = city
            if (tags) find.tags = tags

            const partyups = await Partyup
                .find(find, { password: 0, __v: 0 }).lean()
                .sort({ 'date': +1 })
                .limit(perPage)
                .skip(perPage * (page - 1))
            
            partyups.forEach(partyup => {
                partyup.id = partyup._id.toString()
                delete partyup._id
            })

            return partyups
        })()
    },

    /**
     *
     * @param {string} userId -> The id of the user.
     * 
     * @throws {TypeError} On not string data.
     * @throws {Error} On empty or blank data.
     * @throws {TypeError} On not boolean data.
     * @throws {TypeError} On not number data.
     * @throws {TypeError} On not date data.
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong data.
     */
    listPartyupsCreatedBy(userId) {
        validateLogic([{ key: 'userId', value: userId, type: String }])

        return (async () => {
            const partyups = await Partyup.find({ user: userId }, { description: 0, user: 0, tags: 0, '__v': 0 }).lean()

            partyups.forEach(partyup => {
                partyup.id = partyup._id.toString()
                delete partyup._id
            })

            return partyups
        })()
    },

    /**
     *
     * @param {string} userId -> The id of the user.
     * 
     * @throws {TypeError} On not string data.
     * @throws {Error} On empty or blank data.
     * @throws {TypeError} On not boolean data.
     * @throws {TypeError} On not number data.
     * @throws {TypeError} On not date data.
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong data.
     */
    listPartyupsIAssist(userId) {
        validateLogic([{ key: 'userId', value: userId, type: String }])

        return (async () => {
            const partyups = await Partyup.find({ assistants: userId }, { description: 0, tags: 0, '__v': 0 }).lean()

            partyups.forEach(partyup => {
                partyup.id = partyup._id.toString()
                delete partyup._id
            })

            return partyups
        })()
    },

    /**
     *
     * @param {string} userId -> The id of the user.
     * @param {string} partyupId -> The id of the partyup.
     * 
     * @throws {TypeError} On not string data.
     * @throws {Error} On empty or blank data.
     * @throws {TypeError} On not boolean data.
     * @throws {TypeError} On not number data.
     * @throws {TypeError} On not date data.
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong data.
     */
    assistToPartyup(userId, partyupId) {
        validateLogic([
            { key: 'userId', value: userId, type: String },
            { key: 'partyupId', value: partyupId, type: String },
        ])

        return (async () => {
            const partyup = await Partyup.findById(partyupId)
            
            const userAssist = partyup.assistants.find(user => user === userId)

            if (typeof userAssist === 'string') throw new ValueError('User is on assistance list')

            partyup.assistants.push(userId)

            return partyup.save()
        })()
    },

    /**
    *
    * @param {string} userId -> The id of the user.
    * @param {string} partyupId -> The id of the partyup.
    * 
    * @throws {TypeError} On not string data.
    * @throws {Error} On empty or blank data.
    * @throws {TypeError} On not boolean data.
    * @throws {TypeError} On not number data.
    * @throws {TypeError} On not date data.
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data.
    */
    notAssistToPartyup(userId, partyupId) {
        validateLogic([
            { key: 'userId', value: userId, type: String },
            { key: 'partyupId', value: partyupId, type: String },
        ])

        return (async () => {
            const partyup = await Partyup.findById(partyupId)
            
            const userNoAssist = partyup.assistants.filter(user => {
                user === userId
                return user !== userId
            })

            partyup.assistants = userNoAssist

            return partyup.save()
        })()
    },

    /**
    *
    * @param {string} userId -> The id of the user.
    * @param {string} partyupId -> The id of the partyup.
    * 
    * @throws {TypeError} On not string data.
    * @throws {Error} On empty or blank data.
    * @throws {TypeError} On not boolean data.
    * @throws {TypeError} On not number data.
    * @throws {TypeError} On not date data.
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data.
    */
    deletePartyup(userId, partyupId) {
        validateLogic([
            { key: 'userId', value: userId, type: String },
            { key: 'partyupId', value: partyupId, type: String },
        ])
        return (async () => {
            //DELETE COMMENTARIES FROM PARTYUP
            const comments = await Commentary.find({ partyup: partyupId })

            if (comments) {
                comments.map(async () => {
                    await Commentary.findOneAndDelete({ partyup: partyupId })

                    const _comment = await Commentary.findByIdAndDelete({partyup: partyupId})
                })
            }

            //DELETE PARTYUP
            const partyup = await Partyup.findById(partyupId)

            if (userId === partyup.user)

                await Partyup.findByIdAndDelete(partyupId)

            const _partyup = await Partyup.findByIdAndDelete(partyupId)
        })()
    },

    /**
    *
    * @param {string} userId -> The id of the user.
    * @param {string} partyupId -> The id of the partyup.
    * @param {string} text -> The text of the commentary.
    * 
    * @throws {TypeError} On not string data.
    * @throws {Error} On empty or blank data.
    * @throws {TypeError} On not boolean data.
    * @throws {TypeError} On not number data.
    * @throws {TypeError} On not date data.
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data.
    */
    commentPartyup(userId, partyupId, text) {
        validateLogic([
            { key: 'userId', value: userId, type: String },
            { key: 'partyupId', value: partyupId, type: String },
            { key: 'text', value: text, type: String }
        ])

        return (async () => {
            const commentary = await new Commentary({ user: userId, partyup: partyupId, text })

            await commentary.save()
        })()
    },

    /**
     *
     * @param {string} partyupId -> The id of the partyup.
     * 
     * @throws {TypeError} On not string data.
     * @throws {Error} On empty or blank data.
     * @throws {TypeError} On not boolean data.
     * @throws {TypeError} On not number data.
     * @throws {TypeError} On not date data.
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong data.
     */
    retrieveComments(partyupId) {
        validateLogic([{ key: 'partyupId', value: partyupId, type: String }])

        return (async () => {
            const comments = await Commentary.find({ partyup: partyupId }, { __v: 0 }).populate('user', { password: 0, __v: 0 }).lean()

            if (!comments) throw new NotFoundError(`partyup with id ${partyupId} not have comments`)

            comments.forEach(comment => {
                if (comment.user._id) {
                    comment.user.id = comment.user._id.toString()
                    delete comment.user._id
                }

                comment.id = comment._id.toString()
                delete comment._id

                comment.partyup = comment.partyup.toString()
            })
            return comments
        })()
    },

    /**
     *
     * @param {string} userId -> The id of the user.
     * @param {string} text -> The text of the commentary.
     * 
     * @throws {TypeError} On not string data.
     * @throws {Error} On empty or blank data.
     * @throws {TypeError} On not boolean data.
     * @throws {TypeError} On not number data.
     * @throws {TypeError} On not date data.
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong data.
     */
    deleteComment(commentId, userId) {

        validateLogic([
            { key: 'commentId', value: commentId, type: String },
            { key: 'userId', value: userId, type: String }
        ])

        return (async () => {
            const comment = await Commentary.findById(commentId)

            if (userId == comment.user) {
                await Commentary.findByIdAndDelete(comment.id)

                const _comment = await Commentary.findByIdAndDelete(comment.id)
            }
        })()
    }
}

module.exports = logic