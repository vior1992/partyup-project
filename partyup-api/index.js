require('dotenv').config()

const { mongoose } = require('partyup-data')
const express = require('express')
const cors = require('./utilities/cors')
const package = require('./package.json')
const router = require('./routes')

const { PORT, MONGO_URL } = process.env

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
        console.log(`database server running at ${MONGO_URL}`)

        const [, , port = PORT || 8080 ] = process.argv

        const app = express()

        app.use(cors)

        app.use('/api', router)

        app.listen(port, () => console.log(`${package.name} ${package.version} up and running on port ${port}`))
    })