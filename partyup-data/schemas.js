const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

const Partyup = new Schema ({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    city: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    assistants: {
        type: Array,
        required: true
    },
    picture: {
        type: String,
        required: false,
        default: "./images/partyup.jpg"
    }
})

const User = new Schema ({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false,
    }
})

const Commentary = new Schema ({
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    partyup: {
        type: ObjectId,
        ref: 'Partyup',
        required: true

    },
    text: {
        type: String,
        required: true
    }
})

module.exports = {
    Partyup,
    User,
    Commentary
}