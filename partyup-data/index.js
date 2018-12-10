const mongoose = require('mongoose')
const { User, Partyup, Commentary } = require('./schemas')

module.exports = {
    mongoose,
    models: {
        User: mongoose.model('User', User),
        Partyup: mongoose.model('Partyup', Partyup),
        Commentary: mongoose.model('Commentary', Commentary)  
    }
}