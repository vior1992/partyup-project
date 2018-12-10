const express = require('express')
const router = express.Router()
const jsonBP = require('body-parser').json()
const logic = require('../logic')
const routeHandler = require('./route-handler')
const jwt = require('jsonwebtoken')
const jwtVerifier = require('./jwt-verifier')
const bearerTokenParser = require('../utilities/bearer-token-parser')
const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: 'vior1992',
    api_key: '193425753116639',
    api_secret: 'xCezhtXMWcCFHWY8xB6W1m9feIs'
})

const { env: { JWT_SECRET } } = process

router.post('/users', jsonBP, (req, res) => {
    routeHandler(() => {
        const { name, surname, city, username, password} = req.body

        return logic.registerUser( name, surname, city, username, password)
            .then(() => {
                res.status(201)

                res.json({
                    message: `New user with username ${username} registered!`
                })
            })
    },res)
})

router.post('/authenticate', jsonBP, (req, res) => {
    routeHandler(() => {
        const { username, password } = req.body

        return logic.authenticateUser(username, password)
            .then(id => {
                const token = jwt.sign({ sub: id }, JWT_SECRET)

                res.json({
                    message: `Logged with user ${username}!`,
                    data: { id, token }
                })
            })
    },res)
})

router.get('/users/:id', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub } = req
        
        if (id !== sub) throw Error('token sub does not match user id')
    
        return logic.retrieveLoggedUser(id)
            .then(user => {
                res.status(200)

                res.json({ data: user })
            })
    },res)
})

router.get('/users/partyup/:userId', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { params: { userId }, sub } = req
        
        return logic.searchUserById(userId)
            .then(user => {
                res.status(200)

                res.json(user)
            })
    },res)
})

router.patch('/users/:userId/avatar', [bearerTokenParser, jwtVerifier, jsonBP], (req, res) => {
    routeHandler(() => {
        const { body: { base64Image }, params: { userId }} = req

        return logic.addUserAvatar(userId, base64Image)
            .then(avatar => {
                res.status(200)

                res.json(avatar)
            })
            .catch((err) => {
                const { message } = err
                res.status(err instanceof LogicError ? 400 : 500).json({ message })
            })
    },res)   
})

router.delete('/users/:userId', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { params: { userId }, sub } = req

        return logic.deleteUser(userId)
            .then(() => {
                res.status(200)

                res.json({
                    message: `User with id ${userId} and all his partyups has been deleted with success!`
                })
            })
    },res)
})

router.post('/users/:userId/partyups', [bearerTokenParser, jwtVerifier, jsonBP], (req, res) => {
    routeHandler(() => {
        const { params: { userId }, body: { title, description, date, city, place, tags, base64Image} } = req

        return logic.createPartyup(title, description, new Date(date), city, place, tags, userId, base64Image)
            .then(() => {
                res.status(201)

                res.json({
                    message: `Partyup in ${city} has been created for the user ${userId}!`
                })
            })
    },res)
})

router.patch('/partyups/picture', [bearerTokenParser, jwtVerifier, jsonBP], (req, res) => {
    routeHandler(() => {
        const { body: { base64Image }, params: { userId }} = req

        return logic.addPartyupPicture(base64Image)
            .then(picture => res.status(200).json({ status: 'OK', picture }))
            .catch((err) => {
                const { message } = err
                res.status(err instanceof LogicError ? 400 : 500).json({ message })
            })
    },res)   
})

router.get('/users/:userId/partyups/search?', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        let { query: { perPage = 10, page = 1, city, tags}} = req

        perPage = Number(perPage)

        page = Number(page)
        return logic.listPartyups(perPage = 30, page = 1, city, tags)
            .then(partyups => {
                res.status(200)

                res.json({ partyups })
            })
    },res)
})

router.get('/partyups/:partyupId', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        let { params: { partyupId }} = req

        return logic.searchPartyupById(partyupId)
            .then(partyup => {
                res.status(200)

                res.json(partyup)
            })
    },res)
})

router.get('/partyups', (req, res) => {
    routeHandler(() => {
        let { perPage = 10, page = 1, city, tags} = req.query

        perPage = Number(perPage)

        page = Number(page)

        return logic.listPartyups(perPage = 3, page, city, tags)
            .then(partyups => {
                res.status(200)

                res.json({ partyups })
            })
    },res)
})

router.get('/users/:userId/partyups', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { params: { userId }, sub } = req

        return logic.listPartyupsCreatedBy(userId)
            .then(partyups => {
                res.status(200)

                res.json({ partyups })
            })
    },res)
})

router.get('/users/:userId/partyups/assistence', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { params: { userId }, sub } = req

        return logic.listPartyupsIAssist(userId)
            .then(partyups => {
                res.status(200)

                res.json({ partyups })
            })
    },res)
})

router.get('/users/:userId/partyups/:partyupId/assistence', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { params: { userId , partyupId }, sub } = req

        return logic.assistToPartyup(userId, partyupId)
            .then(partyup => {
                res.status(200)

                res.json({ partyup })
            })
    },res)   
})

router.get('/users/:userId/partyups/:partyupId/notAssistence', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { params: { userId , partyupId }, sub } = req

        return logic.notAssistToPartyup(userId, partyupId)
            .then(partyup => {
                res.status(200)

                res.json( partyup )
            })
    },res)
})

router.delete('/users/:userId/partyups/:partyupId', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { params: { userId , partyupId }, sub } = req

        return logic.deletePartyup(userId, partyupId)
            .then(() => {
                res.status(200)

                res.json({
                    message: `Partyup in ${partyupId} created for ${userId} has been deleted with success!`
                })
            })
    },res)
})

router.post('/users/:userId/partyups/:partyupId/commentaries', [bearerTokenParser, jwtVerifier, jsonBP], (req, res) => {
    routeHandler(() => {
        const { params: { userId , partyupId }, body: { comments }} = req

        return logic.commentPartyup(userId, partyupId, comments)
            .then(() => {
                res.status(201)

                res.json({
                    message: `Comment added for user ${userId} on partyup ${partyupId}!`
                })
            })
    },res)
})

router.get('/partyups/:partyupId/comments', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { params: { partyupId }, sub } = req
            
        return logic.retrieveComments(partyupId)
            .then(comments => {
                res.status(200)

                res.json(comments)
            })
    },res)
})

router.delete('/users/:userId/partyups/:partyupId/commentaries/:commentId', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { params: { commentId, partyupId, userId }, sub } = req

        return logic.deleteComment(commentId, userId)
            .then(() => {
                res.status(200)

                res.json({
                    message: `Comment ${commentId} on partyup ${partyupId} has been deleted with success!`
                })
            })
    },res)
})

module.exports = router