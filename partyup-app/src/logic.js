//RUN APP
import validateLogic from './utilities/validate'
//RUN TEST
// const validateLogic = require('./utilities/validate')


const logic = {
    _userId: sessionStorage.getItem('userId') || null,
    _token: sessionStorage.getItem('token') || null,

    url: 'NO-URL',

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
        
        return fetch(`${this.url}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ name, surname, city, username, password })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
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
        
        return fetch(`${this.url}/authenticate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ username, password })
        })
            .then(res => res.json())
            .then(res => {
                
                if (res.error) throw Error(res.error)

                const { id, token } = res.data

                this._userId = id
                this._token = token

                sessionStorage.setItem('userId', id)
                sessionStorage.setItem('token', token)
            })
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
    retrieveLoggedUser() {
        return fetch(`${this.url}/users/${this._userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}` 
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.error) throw Error(res.error)
            
            return res.data
        })
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
    searchUserById(userId) {
        validateLogic([{ key: 'userId', value: userId, type: String }])

        return fetch(`${this.url}/users/partyup/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`  
            },
        })  
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
                
                return res
            })
    },

    /**
     * 
     * @param {string} base64Image -> The chunk of picture that has been upload to cloudinary.
     * 
     * @throws {TypeError} On not string data.
     * @throws {Error} On empty or blank data.
     * @throws {TypeError} On not boolean data.
     * @throws {TypeError} On not number data.
     * @throws {TypeError} On not date data.
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong data.
     */
    addUserAvatar(base64Image){
        validateLogic([{ key: 'base64Image', value: base64Image, type: String }])
            
        return fetch(`${this.url}/users/${this._userId}/avatar`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${this._token}`,
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ base64Image })
        })
            .then(res => res.json())
            .then(res => {

                if (res.error) throw Error(res.error)

                return res.avatar
            })

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
    deleteUser(){
        const  userId = this._userId
        
        validateLogic([{ key: 'userId', value: userId, type: String }])
        
        return fetch(`${this.url}/users/${this._userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this._token}`  
            },
        })  
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
                
                return res
            })
    },

    /**
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong data.
     */
    get loggedIn() {
        return !!this._userId
    },

    /**
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong data.
     */
    logout() {
        this._userId = null
        this._token = null

        sessionStorage.removeItem('userId')
        sessionStorage.removeItem('token')
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
     * @param {string} chunk -> The chunk of the partyup (Optional).
     * 
     * @throws {TypeError} On not string data.
     * @throws {Error} On empty or blank data.
     * @throws {TypeError} On not boolean data.
     * @throws {TypeError} On not number data.
     * @throws {TypeError} On not date data.
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong data.
     */
    createPartyup(title, description, date, city, place, tags, base64Image) {
        validateLogic([
            { key: 'title', value: title, type: String },
            { key: 'description', value: description, type: String },
            { key: 'date', value: date, type: Date },
            { key: 'city', value: city, type: String },
            { key: 'place', value: place, type: String },
            { key: 'tags', value: tags, type: String },
            { key: 'base64Image', value: base64Image, type: String }
        ])
        
        return fetch(`${this.url}/users/${this._userId}/partyups`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}` 
            },
            body: JSON.stringify({ title, description, date, city, place, tags, base64Image })
        })
            .then(res => res.json())
            .then(res => {
                
                if (res.error) throw Error(res.error)
            })
    },

    /**
     * 
     * @param {string} base64Image -> The base64Image of picture that has been upload to cloudinary.
     * 
     * @throws {TypeError} On not string data.
     * @throws {Error} On empty or blank data.
     * @throws {TypeError} On not boolean data.
     * @throws {TypeError} On not number data.
     * @throws {TypeError} On not date data.
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong data.
     */
    addPartyupPicture(base64Image){
        validateLogic([{ key: 'base64Image', value: base64Image, type: String }])
        
        return fetch(`${this.url}/partyups/picture`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${this._token}`,
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ base64Image })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.picture
            })

    },

    /**
     * 
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
    searchPartyups(city, tags) {
        validateLogic([
            { key: 'city', value: city, type: String, optional: true},
            { key: 'tags', value: tags, type: String, optional: true}
        ])

        let _url = `${this.url}/users/${this._userId}/partyups/search?`

        if (city)
            _url += `city=${city}`

        if (tags)
            _url += `${city? '&' : ''}tags=${tags}`

        return fetch(`${_url}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`  
            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
                
                return res.partyups
            })
    },

    /**
     * @returns {Promise} Resolves on correct data, rejects on wrong data.
     */
    listPartyups() {
        return fetch(`${this.url}/partyups`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}` 
            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
                
                return res.partyups
            })
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
    searchPartyupsById(partyupId) {
        validateLogic([{ key: 'partyupId', value: partyupId, type: String }])

        return fetch(`${this.url}/partyups/${partyupId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`  
            },
        })  
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
                
                return res
            })
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
    assistToPartyup(partyupId) {
        validateLogic([
            { key: 'partyupId', value: partyupId, type: String },
        ])

        return fetch(`${this.url}/users/${this._userId}/partyups/${partyupId}/assistence`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}` 
            },
           
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
                
                return res
            })
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
    notAssistToPartyup(partyupId) {
        validateLogic([
            { key: 'partyupId', value: partyupId, type: String },
        ])

        return fetch(`${this.url}/users/${this._userId}/partyups/${partyupId}/notAssistence`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}` 
            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res
            })
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
    itemListPartyupsCreatedBy(userId) {
        validateLogic([
            { key: 'userId', value: userId, type: String },
        ])

        return fetch(`${this.url}/users/${userId}/partyups`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}` 
            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
                
                return res.partyups
            })
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
    itemListPartyupsIAssist(userId) {
        validateLogic([
            { key: 'userId', value: userId, type: String },
        ])

        return fetch(`${this.url}/users/${userId}/partyups/assistence`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}` 
            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
                
                return res.partyups
            })
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
    deletePartyup(partyupId) {
        validateLogic([
            { key: 'partyupId', value: partyupId, type: String },
        ])

        return fetch(`${this.url}/users/${this._userId}/partyups/${partyupId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this._token}` 
            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
                
                return res
            })
    },

     /**
     *
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
    commentPartyup(partyupId, comments) {
        validateLogic([
            { key: 'partyupId', value: partyupId, type: String },
            { key: 'comments', value: comments, type: String }
        ])

        return fetch(`${this.url}/users/${this._userId}/partyups/${partyupId}/commentaries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}` 
            },
            body: JSON.stringify({comments})
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
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
        validateLogic([
            { key: 'partyupId', value: partyupId, type: String },
        ])

        return fetch(`${this.url}/partyups/${partyupId}/comments`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}` 
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.error) throw Error(res.error)
            
            return res
        })
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
    deleteComment(commentId, partyupId) {
        validateLogic([
            { key: 'commentId', value: commentId, type: String },
            { key: 'partyupId', value: partyupId, type: String }
        ])

        return fetch(`${this.url}/users/${this._userId}/partyups/${partyupId}/commentaries/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this._token}` 
            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
                
                return res
            })
    },
}
//RUN
export default logic
//TEST
// module.exports = logic


