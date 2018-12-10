require('dotenv').config()

require('isomorphic-fetch')

global.sessionStorage = require('sessionstorage')

const { TypeError } = require('./errors')
const logic = require('./logic')
const { mongoose, models: { User, Partyup, Commentary } } = require('partyup-data')
const { expect } = require('chai')

logic.url = process.env.REACT_APP_API_URL

const MONGO_URL = 'mongodb://localhost:27017/partyup-test'

describe('logic', () => {
    before(() => mongoose.connect(`${MONGO_URL}`, { useNewUrlParser: true, useCreateIndex: true }))
    
    beforeEach(() => Promise.all([User.deleteMany(), Partyup.deleteMany(), Commentary.deleteMany()]))

    describe('user', () => {
        describe('register', () => {
            let name, surname, city, username, password

            beforeEach(() => {
                name = `name-${Math.random()}`
                surname = `surname-${Math.random()}`
                city = `city-${Math.random()}`
                username = `username-${Math.random()}`
                password = `password-${Math.random()}`
            })

            it('should succeed on correct data', async () => {
                const res = await logic.registerUser(name, surname, city, username, password)

                expect(res).to.be.undefined

                const _users = await User.find()

                expect(_users.length).to.equal(1)

                const [user] = _users

                expect(user.id).to.be.a('string')
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.city).to.equal(city)
                expect(user.username).to.equal(username)
                expect(user.password).to.equal(password)

            })

            //NAME FAIL TESTS//

            it('should fail on undefined name', () => {
                expect(() => logic.registerUser(undefined, surname, city, username, password)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty or blank username', () => {
                expect(() => logic.registerUser('  ', surname, city, username, password)).to.throw(Error, 'name is empty or blank')
            })

            it('should fail on number username (not a string)', () => {
                expect(() => logic.registerUser(1, surname, city, username, password)).to.throw(Error, '1 is not a string')
            })

            it('should fail on boolean username (not a string)', () => {
                expect(() => logic.registerUser(false, surname, city, username, password)).to.throw(Error, 'false is not a string')
            })

            //SURNAME FAIL TESTS//

            it('should fail on undefined surname', () => {
                expect(() => logic.registerUser(name, undefined, city, username, password)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty or blank surname', () => {
                expect(() => logic.registerUser(name, '  ', city, username, password)).to.throw(Error, 'surname is empty or blank')
            })

            it('should fail on number surname (not a string)', () => {
                expect(() => logic.registerUser(name, 1, city, username, password)).to.throw(Error, '1 is not a string')
            })

            it('should fail on boolean surname (not a string)', () => {
                expect(() => logic.registerUser(name, false, city, username, password)).to.throw(Error, 'false is not a string')
            })

            //CITY FAIL TESTS//

            it('should fail on undefined city', () => {
                expect(() => logic.registerUser(name, surname, undefined, username, password)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty or blank city', () => {
                expect(() => logic.registerUser(name, surname, '  ', username, password)).to.throw(Error, 'city is empty or blank')
            })

            it('should fail on number city (not a string)', () => {
                expect(() => logic.registerUser(name, surname, 1, username, password)).to.throw(Error, '1 is not a string')
            })

            it('should fail on boolean city (not a string)', () => {
                expect(() => logic.registerUser(name, surname, false, username, password)).to.throw(Error, 'false is not a string')
            })

            //USERNAME FAIL TESTS//

            it('should fail on undefined username', () => {
                expect(() => logic.registerUser(name, surname, city, undefined, password)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty or blank username', () => {
                expect(() => logic.registerUser(name, surname, city, '  ', password)).to.throw(Error, 'username is empty or blank')
            })

            it('should fail on number username (not a string)', () => {
                expect(() => logic.registerUser(name, surname, city, 9, password)).to.throw(Error, '9 is not a string')
            })

            it('should fail on boolean username (not a string)', () => {
                expect(() => logic.registerUser(name, surname, city, true, password)).to.throw(Error, 'true is not a string')
            })

            //PASSWORD FAIL TESTS//

            it('should fail on undefined password', () => {
                expect(() => logic.registerUser(name, surname, city, username, undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty or blank password', () => {
                expect(() => logic.registerUser(name, surname, city, username, '  ')).to.throw(Error, 'password is empty or blank')
            })

            it('should fail on number password (not a string)', () => {
                expect(() => logic.registerUser(name, surname, city, username, 90)).to.throw(Error, '90 is not a string')
            })

            it('should fail on boolean password (not a string)', () => {
                expect(() => logic.registerUser(name, surname, city, username, false)).to.throw(Error, 'false is not a string')
            })

        })

        describe('authenticate', () => {

            beforeEach(async () => {
                name = `n-${Math.random()}`
                surname = `s-${Math.random()}`
                city = `c-${Math.random()}`
                username = `u-${Math.random()}`
                password = `p-${Math.random()}`

                user = await new User({ name, surname, city, username, password }).save()
            })

            it('should authenticate on correct credentials', () => {
                const { username, password } = user
                
                return logic.authenticateUser(username, password)
                    .then(id => {
                        expect(id).to.be.undefined

                        return User.find()
                            .then(_users => {
                                const [_user] = _users
                                const session = sessionStorage.getItem('userId', id)
                                
                                expect(_user.id).to.equal(session)
                            })
                    })
            })

            //USERNAME FAIL TESTS//

            it('should fail on undefined username', () => {
                expect(() => logic.authenticateUser(undefined, user.password)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty or blank username', () => {
                expect(() => logic.authenticateUser('   ', user.password)).to.throw(Error, 'username is empty or blank')
            })

            it('should fail on number username (not a string)', () => {
                expect(() => logic.authenticateUser(3, user.password)).to.throw(Error, '3 is not a string')
            })

            it('should fail on boolean username (not a string)', () => {
                expect(() => logic.authenticateUser(true, user.password)).to.throw(Error, 'true is not a string')
            })

            //PASSWORD FAIL TESTS//

            it('should fail on undefined password', () => {
                expect(() => logic.authenticateUser(user.username, undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty or blank password', () => {
                expect(() => logic.authenticateUser(user.username, '   ')).to.throw(Error, 'password is empty or blank')
            })

            it('should fail on number password (not a string)', () => {
                expect(() => logic.authenticateUser(user.username, 3)).to.throw(Error, '3 is not a string')
            })

            it('should fail on boolean password (not a string)', () => {
                expect(() => logic.authenticateUser(user.username, true)).to.throw(Error, 'true is not a string')
            })
        })

        describe('find user by id', () => {
            let user, name, surname, city, username, password

            beforeEach(async () => {
                name = `n-${Math.random()}`
                surname = `s-${Math.random()}`
                city = `c-${Math.random()}`
                username = `u-${Math.random()}`
                password = `p-${Math.random()}`

                user = await new User({ name, surname, city, username, password }).save()

                await logic.authenticateUser(username, password)
            })

            it('should succeed on correct data', async () => {
                const _user = await logic.searchUserById(user.id)

                expect(_user.id).to.be.a('string')
                expect(_user.name).to.equal(user.name)
                expect(_user.surname).to.equal(user.surname)
                expect(_user.city).to.equal(user.city)
                expect(_user.username).to.equal(user.username)
                expect(_user.password).to.equal(user.password)
            })
        })

        describe('partyups', () => {
            describe('create', () => {
                let user, title, description, date, city, tags

                beforeEach(async () => {
                    name = `n-${Math.random()}`
                    surname = `s-${Math.random()}`
                    city = `c-${Math.random()}`
                    username = `u-${Math.random()}`
                    password = `p-${Math.random()}`

                    user = await new User({ name, surname, city, username, password }).save()

                    await logic.authenticateUser(username, password)

                    title = "prueba"
                    description = 'prueba en el test'
                    date = new Date()
                    city = '01'
                    place = 'skylab'
                    tags = "01"
                    picture = "sdasda"
                })

                false && it('should create on correct data', async () => {
                    const res = await logic.createPartyup(title, description, date, city, place, tags, picture)
                    
                    expect(res).to.be.undefined

                    const _partyups = await Partyup.find()
                    
                    expect(_partyups.length).to.equal(1)

                    const [partyup] = _partyups

                    expect(partyup.title).to.equal(title)
                    expect(partyup.title).to.be.a('string')

                    expect(partyup.description).to.equal(description)
                    expect(partyup.description).to.be.a('string')

                    // expect(partyup.date).to.equal(date)
                    // expect(partyup.date).to.be.a('date')

                    expect(partyup.city).to.equal(city)
                    expect(partyup.city).to.be.a('string')

                    expect(partyup.place).to.equal(place)
                    expect(partyup.place).to.be.a('string')

                    expect(partyup.tags).to.equal(tags)
                    expect(partyup.tags).to.be.a('string')
                })

                //TITLE FAIL TESTS//
                it('should fail on undefined title ', () => {
                    expect(() => logic.createPartyup(undefined, description, date, city, place, tags, user.id)).to.throw(TypeError, 'undefined is not a string')
                })

                it('should fail on empty or blank title', () => {
                    expect(() => logic.createPartyup('  ', description, date, city, place, tags, user.id)).to.throw(Error, 'title is empty or blank')
                })

                it('should fail on number title (not a string)', () => {
                    expect(() => logic.createPartyup(1, description, date, city, place, tags, user.id)).to.throw(Error, '1 is not a string')
                })

                it('should fail on boolean title (not a string)', () => {
                    expect(() => logic.createPartyup(true, description, date, city, place, tags, user.id)).to.throw(Error, 'true is not a string')
                })

                //DESCRIPTION FAIL TESTS//
                it('should fail on undefined description ', () => {
                    expect(() => logic.createPartyup(title, undefined, date, city, place, tags, user.id)).to.throw(TypeError, 'undefined is not a string')
                })

                it('should fail on empty or blank description', () => {
                    expect(() => logic.createPartyup(title, '  ', date, city, place, tags, user.id)).to.throw(Error, 'description is empty or blank')
                })

                it('should fail on number description (not a string)', () => {
                    expect(() => logic.createPartyup(title, 1, date, city, place, tags, user.id)).to.throw(Error, '1 is not a string')
                })

                it('should fail on boolean description (not a string)', () => {
                    expect(() => logic.createPartyup(title, true, date, city, place, tags, user.id)).to.throw(Error, 'true is not a string')
                })

                //CITY FAIL TEST
                it('should fail on undefined city ', () => {
                    expect(() => logic.createPartyup(title, description, date, undefined, place, tags, user.id)).to.throw(TypeError, 'undefined is not a string')
                })

                it('should fail on empty or blank city', () => {
                    expect(() => logic.createPartyup(title, description, date, '  ', place, tags, user.id)).to.throw(Error, 'city is empty or blank')
                })

                it('should fail on number city (not a string)', () => {
                    expect(() => logic.createPartyup(title, description, date, 1, place, tags, user.id)).to.throw(Error, '1 is not a string')
                })

                it('should fail on boolean city (not a string)', () => {
                    expect(() => logic.createPartyup(title, description, date, true, place, tags, user.id)).to.throw(Error, 'true is not a string')
                })

                //PLACE FAIL TEST
                it('should fail on undefined place ', () => {
                    expect(() => logic.createPartyup(title, description, date, city, undefined, tags, user.id)).to.throw(TypeError, 'undefined is not a string')
                })

                it('should fail on empty or blank place', () => {
                    expect(() => logic.createPartyup(title, description, date, city, '  ', tags, user.id)).to.throw(Error, 'place is empty or blank')
                })

                it('should fail on number place (not a string)', () => {
                    expect(() => logic.createPartyup(title, description, date, city, 1, tags, user.id)).to.throw(Error, '1 is not a string')
                })

                it('should fail on boolean place (not a string)', () => {
                    expect(() => logic.createPartyup(title, description, date, city, true, tags, user.id)).to.throw(Error, 'true is not a string')
                })

                //TAGS FAIL TEST
                it('should fail on undefined tags ', () => {
                    expect(() => logic.createPartyup(title, description, date, city, place, undefined, user.id)).to.throw(TypeError, 'undefined is not a string')
                })

                it('should fail on empty or blank tags', () => {
                    expect(() => logic.createPartyup(title, description, date, city, place, '  ', user.id)).to.throw(Error, 'tags is empty or blank')
                })

                it('should fail on number tags (not a string)', () => {
                    expect(() => logic.createPartyup(title, description, date, city, place, 1, user.id)).to.throw(Error, '1 is not a string')
                })

                it('should fail on boolean tags (not a string)', () => {
                    expect(() => logic.createPartyup(title, description, date, city, place, true, user.id)).to.throw(Error, 'true is not a string')
                })

                //USER.ID FAIL TEST
                it('should fail on undefined userid ', () => {
                    expect(() => logic.createPartyup(title, description, date, city, place, tags, undefined)).to.throw(TypeError, 'undefined is not a string')
                })

                it('should fail on empty or blank userid', () => {
                    expect(() => logic.createPartyup(title, description, date, city, place, tags, '  ')).to.throw(Error, 'base64Image is empty or blank')
                })

                it('should fail on number userid (not a string)', () => {
                    expect(() => logic.createPartyup(title, description, date, city, place, tags, 1)).to.throw(Error, '1 is not a string')
                })

                it('should fail on boolean userid (not a string)', () => {
                    expect(() => logic.createPartyup(title, description, date, city, place, tags, true)).to.throw(Error, 'true is not a string')
                })
            })

            describe('list', () => {
                let user, partyup, partyup2, _city, _tags, name, surname, city, username, password

                beforeEach(async () => {
                    name = `n-${Math.random()}`
                    surname = `s-${Math.random()}`
                    city = `c-${Math.random()}`
                    username = `u-${Math.random()}`
                    password = `p-${Math.random()}`

                    user = await new User({ name, surname, city, username, password }).save()

                    await logic.authenticateUser(username, password)

                    partyup = await new Partyup({ title: "prueba", description: 'prueba en el test', date: new Date(), city: '01', place: 'skylab', tags: "01", user: user.id, picture: "string" }).save()
                    partyup2 = await new Partyup({ title: "prueba2", description: 'prueba en el test2', date: new Date(), city: '02', place: 'skylab2', tags: "02", user: user.id, picture: "string" }).save()
                    _city = undefined
                    _tags = undefined
                })

                it('should list on correct data (listPartyupsCreatedBy)', () =>
                    logic.searchPartyups(_city, _tags)
                        .then(partyups => {
                            return Partyup.find()
                                .then(_partyups => {
                                    expect(partyups.length).to.equal(2)

                                    expect(partyups.length).to.equal(_partyups.length)
                                    const [_partyup, _partyup2] = _partyups

                                    expect(partyup.id).to.equal(_partyup.id)
                                    expect(partyup.title).to.equal(_partyup.title)
                                    expect(partyup.description).to.equal(_partyup.description)
                                    expect(partyup.place).to.equal(_partyup.place)
                                    expect(partyup.city).to.equal(_partyup.city)
                                    expect(partyup.tags).to.equal(_partyup.tags)

                                    expect(partyup2.id).to.equal(_partyup2.id)
                                    expect(partyup2.title).to.equal(_partyup2.title)
                                    expect(partyup2.description).to.equal(_partyup2.description)
                                    expect(partyup2.place).to.equal(_partyup2.place)
                                    expect(partyup2.city).to.equal(_partyup2.city)
                                    expect(partyup2.tags).to.equal(_partyup2.tags)

                                    const [__partyup, __partyup2] = partyups

                                    expect(__partyup.id).to.equal(_partyup.id)
                                    expect(__partyup.title).to.equal(_partyup.title)
                                    expect(__partyup.description).to.equal(_partyup.description)
                                    expect(__partyup.place).to.equal(_partyup.place)
                                    expect(__partyup.city).to.equal(_partyup.city)
                                    expect(__partyup.tags).to.equal(_partyup.tags)

                                    expect(__partyup2.id).to.equal(_partyup2.id)
                                    expect(__partyup2.title).to.equal(_partyup2.title)
                                    expect(__partyup2.description).to.equal(_partyup2.description)
                                    expect(__partyup2.place).to.equal(_partyup2.place)
                                    expect(__partyup2.city).to.equal(_partyup2.city)
                                    expect(__partyup2.tags).to.equal(_partyup2.tags)
                                })
                        })
                )

                it('should fail on empty or blank city (searchPartyups)', () => {
                    expect(() => logic.searchPartyups('   ', undefined)).to.throw(Error, 'city is empty or blank')
                })

                it('should fail on number city (searchPartyups)', () => {
                    expect(() => logic.searchPartyups(666, undefined)).to.throw(TypeError, '666 is not a string')
                })

                it('should fail on boolean city (searchPartyups)', () => {
                    expect(() => logic.searchPartyups(true, undefined)).to.throw(TypeError, 'true is not a string')
                })
                
                it('should list on correct data(listPartyups)', () =>
                    logic.listPartyups()
                        .then(partyup => {
                            return Partyup.find()
                                .then(_partyups => {

                                    expect(partyup.length).to.equal(2)

                                    expect(partyup.length).to.equal(_partyups.length)

                                    const [_partyup, _partyup2] = _partyups

                                    expect(_partyup.id).to.equal(partyup[0].id)
                                    expect(_partyup.title).to.equal(partyup[0].title)
                                    expect(_partyup.description).to.equal(partyup[0].description)
                                    expect(_partyup.place).to.equal(partyup[0].place)
                                    expect(_partyup.city).to.equal(partyup[0].city)
                                    expect(_partyup.tags).to.equal(partyup[0].tags)

                                    expect(_partyup2.id).to.equal(partyup2.id)
                                    expect(_partyup2.title).to.equal(partyup2.title)
                                    expect(_partyup2.description).to.equal(partyup2.description)
                                    expect(_partyup2.place).to.equal(partyup2.place)
                                    expect(_partyup2.city).to.equal(partyup2.city)
                                    expect(_partyup2.tags).to.equal(partyup2.tags)

                                    const [__partyup, __partyup2] = partyup

                                    expect(_partyup.id).to.equal(__partyup.id)
                                    expect(_partyup.title).to.equal(__partyup.title)
                                    expect(_partyup.description).to.equal(__partyup.description)
                                    expect(_partyup.place).to.equal(__partyup.place)
                                    expect(_partyup.city).to.equal(__partyup.city)
                                    expect(_partyup.tags).to.equal(__partyup.tags)

                                    expect(_partyup2.id).to.equal(__partyup2.id)
                                    expect(_partyup2.title).to.equal(__partyup2.title)
                                    expect(_partyup2.description).to.equal(__partyup2.description)
                                    expect(_partyup2.place).to.equal(__partyup2.place)
                                    expect(_partyup2.city).to.equal(__partyup2.city)
                                    expect(_partyup2.tags).to.equal(__partyup2.tags)
                                })
                        })

                )

                describe('search partyup by partyup Id', () => {
                    let user, partyup, name, surname, city, username, password

                    beforeEach(async () => {
                        name = `n-${Math.random()}`
                        surname = `s-${Math.random()}`
                        city = `c-${Math.random()}`
                        username = `u-${Math.random()}`
                        password = `p-${Math.random()}`
    
                        user = await new User({ name, surname, city, username, password }).save()
    
                        await logic.authenticateUser(username, password)

                        partyup = await new Partyup({ title: "Search partyup by id", description: 'prueba en el test', date: new Date(), city: '01', place: 'skylab', tags: "01", user: user.id }).save()
                    })

                    it('should succeed on correct data (Search partyup by Id)', () => 
                        logic.searchPartyupsById(partyup.id)
                            .then(partyup => {
                                return Partyup.find()
                                    .then(_partyup => {
                                        expect(_partyup).to.exist
                                        expect(_partyup.length).to.equal(3)

                                        expect(_partyup[2].title).to.equal(partyup.title)
                                        expect(_partyup[2].description).to.equal(partyup.description)
                                        expect(_partyup[2].city).to.equal(partyup.city)
                                        expect(_partyup[2].place).to.equal(partyup.place)
                                        expect(_partyup[2].tags).to.equal(partyup.tags)
                                        expect(_partyup[2].user.toString()).to.equal(partyup.user.toString())
                                    })
                            })
                    )
                })

                describe('search partyup Ill assist', () => {
                    let user, partyup

                    beforeEach(async () => {
                        name = `n-${Math.random()}`
                        surname = `s-${Math.random()}`
                        city = `c-${Math.random()}`
                        username = `u-${Math.random()}`
                        password = `p-${Math.random()}`
    
                        user = await new User({ name, surname, city, username, password }).save()
    
                        await logic.authenticateUser(username, password)

                        partyup = await new Partyup({ title: "Search partyup by id", description: 'prueba en el test', date: new Date(), city: '01', place: 'skylab', tags: "01", user: user.id }).save()
                    })

                    it('should succeed on correct data(Partyup Ill assist)', () => 
                        logic.assistToPartyup(partyup.id)
                            .then(() => 
                                logic.itemListPartyupsIAssist(user.id)
                                    .then(partyups => {
                                        debugger
                                        return Partyup.find()
                                            .then(__partyup => {
                                                expect(partyups).to.exist
                                                expect(partyups.length).to.equal(1)
                                                
                                                expect(__partyup[2].title).to.equal(partyup.title)
                                                expect(__partyup[2].description).to.equal(partyup.description)
                                                expect(__partyup[2].city).to.equal(partyup.city)
                                                expect(__partyup[2].place).to.equal(partyup.place)
                                                expect(__partyup[2].tags).to.equal(partyup.tags)
                                                expect(__partyup[2].user.toString()).to.equal(partyup.user.toString())
                                            })
                                    })
                            )
                        
                    )
                    //USER ID TEST FAIL//
                    it('should fail on undefined user id (Partyup Ill assist)', () => {
                        expect(() => logic.itemListPartyupsIAssist(undefined)).to.throw(TypeError, 'undefined is not a string')
                    })

                    it('should fail on empty or blank user id (Partyup Ill assist)', () => {
                        expect(() => logic.itemListPartyupsIAssist(' ')).to.throw(Error, 'userId is empty or blank')
                    })

                    it('should fail on number user id (Partyup Ill assist)', () => {
                        expect(() => logic.itemListPartyupsIAssist(3)).to.throw(TypeError, '3 is not a string')
                    })

                    it('should fail on boolean user id (Partyup Ill assist)', () => {
                        expect(() => logic.itemListPartyupsIAssist(false)).to.throw(TypeError, 'false is not a string')
                    })

               
                })

                describe('assist to partyup', () => {
                    let user, partyup

                    beforeEach(async () => {
                        name = `n-${Math.random()}`
                        surname = `s-${Math.random()}`
                        city = `c-${Math.random()}`
                        username = `u-${Math.random()}`
                        password = `p-${Math.random()}`
    
                        user = await new User({ name, surname, city, username, password }).save()
    
                        await logic.authenticateUser(username, password)

                        
                        partyup = await new Partyup({ title: "Search partyup by id", description: 'prueba en el test', date: new Date(), city: '01', place: 'skylab', tags: "01", user: user.id }).save()
                    })

                    it('should succeed on correct data (assist to partyup)', () => 
                        logic.assistToPartyup(partyup.id)
                            .then(res => {
                                expect(res.partyup.assistants.length).to.equal(1)

                                const { assistants } = res.partyup

                                expect(assistants.length).to.equal(1)
                                expect(assistants[0]).to.equal(user.id)
                            })
                    )
                        
                        //PARTYUP ID TEST FAIL//
                        it('should fail on undefined user id (assist to partyup)', () => {
                            expect(() => logic.assistToPartyup(undefined)).to.throw(TypeError, 'undefined is not a string')
                        })

                        it('should fail on empty or blank user id (assist to partyup)', () => {
                            expect(() => logic.assistToPartyup(' ')).to.throw(Error, 'partyupId is empty or blank')
                        })

                        it('should fail on number user id (assist to partyup)', () => {
                            expect(() => logic.assistToPartyup(3)).to.throw(TypeError, '3 is not a string')
                        })

                        it('should fail on boolean user id (assist to partyup)', () => {
                            expect(() => logic.assistToPartyup(false)).to.throw(TypeError, 'false is not a string')
                        })

                         
                })

                describe('NOT assist to partyup', () => {
                    let user, partyup

                    beforeEach(async () => {
                        name = `n-${Math.random()}`
                        surname = `s-${Math.random()}`
                        city = `c-${Math.random()}`
                        username = `u-${Math.random()}`
                        password = `p-${Math.random()}`
    
                        user = await new User({ name, surname, city, username, password }).save()
    
                        await logic.authenticateUser(username, password)

                        partyup = await new Partyup({ title: "Search partyup by id", description: 'prueba en el test', date: new Date(), city: '01', place: 'skylab', tags: "01", user: user.id }).save()
                    })

                    it('should succeed on correct data (Not assist)', () => 
                        logic.assistToPartyup(partyup.id)
                            .then(res => {
                               
                                expect(res.partyup.assistants.length).to.equal(1)

                                const { assistants } = res.partyup

                                expect(assistants.length).to.equal(1)

                                expect(assistants[0]).to.equal(user.id)
                                
                                return logic.notAssistToPartyup(partyup.id)
                                    .then(res => {
                                        return Partyup.find()
                                            .then(_partyups => {
                                                expect(_partyups).to.exist
                                                expect(_partyups.length).to.equal(3)

                                                expect(_partyups[0].assistants).to.be.an('array')
                                            })
                                    })
                            })
                    )
                     //PARTYUP ID TEST FAIL//
                    it('should fail on undefined partyup id (NOT assist to partyup)', () => {
                        expect(() => logic.notAssistToPartyup(undefined)).to.throw(TypeError, 'undefined is not a string')
                    })

                    it('should fail on empty or blank partyup id (NOT assist to partyup)', () => {
                        expect(() => logic.notAssistToPartyup(' ')).to.throw(Error, 'partyupId is empty or blank')
                    })

                    it('should fail on number partyup id (NOT assist to partyup)', () => {
                        expect(() => logic.notAssistToPartyup(3)).to.throw(TypeError, '3 is not a string')
                    })

                    it('should fail on boolean partyup id (NOT assist to partyup)', () => {
                        expect(() => logic.notAssistToPartyup(false)).to.throw(TypeError, 'false is not a string')
                    })
                })

                //ADD PARTYUP PICTURE
                false && describe('Add picture to partyup', () => {
                    let user, partyup, chunk

                    beforeEach(() => {

                        user = new User({ name: `Dani-${Math.random()}`, surname: `ville-${Math.random()}`, city: `bcn-${Math.random()}`, username: `db-${Math.random()}`, password: `1-${Math.random()}` })
                        partyup = new Partyup({ title: "prueba", description: 'prueba en el test', date: new Date(), city: '01', place: 'skylab', tags: "01", user: user.id, picture: '2' })
                        chunk = "2"

                        return Promise.all([user.save(), partyup.save()]) 
                    })

                    it('should succeed on correct data (upload a picture)', () => 
                        logic.addPartyupPicture(chunk)
                            .then(picture => {
                                return Partyup.find()
                                    .then(_partyups => {
                                        expect(_partyups).to.exist()
                                        expect(_partyups.picture).to.equal(1)
                                    })
                            })
                    )
                })

            })

            // itemListPartyupsCreatedBy
            describe('itemListPartyupsCreatedBy', () => {
                let user, partyup

                beforeEach(async () => {
                    name = `n-${Math.random()}`
                    surname = `s-${Math.random()}`
                    city = `c-${Math.random()}`
                    username = `u-${Math.random()}`
                    password = `p-${Math.random()}`

                    user = await new User({ name, surname, city, username, password }).save()

                    await logic.authenticateUser(username, password)

                    partyup = await new Partyup({ title: "Search partyup by id", description: 'prueba en el test', date: new Date(), city: '01', place: 'skylab', tags: "01", user: user.id }).save()
                    
                })

                it('should succeed on correct data (itemListPartyupsCreatedBy)', () => 
                    logic.itemListPartyupsCreatedBy(user.id)
                        .then(res => {
                        
                            expect(res.length).to.equal(1)

                            expect(res[0].title).to.equal(partyup.title)
                            expect(res[0].description).to.be.undefined
                            expect(res[0].city).to.equal(partyup.city)
                            expect(res[0].tags).to.be.undefined
                            expect(res[0].place).to.equal(partyup.place)
                            expect(res[0].user).to.be.undefined
                        })
                
                )
                 //USER ID TEST FAIL//
                it('should fail on undefined partyup id (NOT assist to partyup)', () => {
                    expect(() => logic.itemListPartyupsCreatedBy(undefined)).to.throw(TypeError, 'undefined is not a string')
                })

                it('should fail on empty or blank partyup id (NOT assist to partyup)', () => {
                    expect(() => logic.itemListPartyupsCreatedBy(' ')).to.throw(Error, 'userId is empty or blank')
                })

                it('should fail on number partyup id (NOT assist to partyup)', () => {
                    expect(() => logic.itemListPartyupsCreatedBy(3)).to.throw(TypeError, '3 is not a string')
                })

                it('should fail on boolean partyup id (NOT assist to partyup)', () => {
                    expect(() => logic.itemListPartyupsCreatedBy(false)).to.throw(TypeError, 'false is not a string')
                })
            })

            // itemListPartyupsIAssist
            describe('itemListPartyupsIAssist', () => {
                let user, partyup

                beforeEach(async () => {
                    name = `n-${Math.random()}`
                    surname = `s-${Math.random()}`
                    city = `c-${Math.random()}`
                    username = `u-${Math.random()}`
                    password = `p-${Math.random()}`

                    user = await new User({ name, surname, city, username, password }).save()

                    await logic.authenticateUser(username, password)

                    partyup = await new Partyup({ title: "itemListPartyupsIAssist", description: 'prueba en el test', date: new Date(), city: '01', place: 'skylab', tags: "01", user: user.id }).save()
                    
                    await logic.assistToPartyup(partyup.id)
                })

                it('should succeed on correct data (itemListPartyupsCreatedBy)', () => 
                    logic.itemListPartyupsIAssist(user.id)
                        .then(res => {
                            expect(res.length).to.equal(1)

                            expect(res[0].title).to.equal(partyup.title)
                            expect(res[0].description).to.be.undefined
                            expect(res[0].city).to.equal(partyup.city)
                            expect(res[0].tags).to.be.undefined
                            expect(res[0].place).to.equal(partyup.place)
                            expect(res[0].user).to.equal(partyup.user.toString())
                        })
                )
                 //USER ID TEST FAIL//
                it('should fail on undefined partyup id (NOT assist to partyup)', () => {
                    expect(() => logic.itemListPartyupsIAssist(undefined)).to.throw(TypeError, 'undefined is not a string')
                })

                it('should fail on empty or blank partyup id (NOT assist to partyup)', () => {
                    expect(() => logic.itemListPartyupsIAssist(' ')).to.throw(Error, 'userId is empty or blank')
                })

                it('should fail on number partyup id (NOT assist to partyup)', () => {
                    expect(() => logic.itemListPartyupsIAssist(3)).to.throw(TypeError, '3 is not a string')
                })

                it('should fail on boolean partyup id (NOT assist to partyup)', () => {
                    expect(() => logic.itemListPartyupsIAssist(false)).to.throw(TypeError, 'false is not a string')
                })
            })

            //DELETE PARTYUP
            describe('Should delete partyup', () => {
                let user, partyup

                beforeEach(async () => {
                    name = `n-${Math.random()}`
                    surname = `s-${Math.random()}`
                    city = `c-${Math.random()}`
                    username = `u-${Math.random()}`
                    password = `p-${Math.random()}`

                    user = await new User({ name, surname, city, username, password }).save()

                    await logic.authenticateUser(username, password)

                    partyup = await new Partyup({ title: "Should delete partyup", description: 'prueba en el test', date: new Date(), city: '01', place: 'skylab', tags: "01", user: user.id }).save()
                })

                it('should delete on correct data', () =>
                    logic.deletePartyup(partyup._id.toString())
                        .then(() => {
                            return Partyup.find()
                                .then(partyups => {
                                    expect(partyups).to.exist
                                    expect(partyups).to.be.an('array')
                                    expect(partyups.length).to.equal(0)
                                })
                        })
                )

                 //PARTYUP ID TEST FAIL//
                it('should fail on undefined partyup id (Delete partyup)', () => {
                    expect(() => logic.assistToPartyup(undefined)).to.throw(TypeError, 'undefined is not a string')
                })

                it('should fail on empty or blank partyup id (Delete partyup)', () => {
                    expect(() => logic.assistToPartyup(' ')).to.throw(Error, 'partyupId is empty or blank')
                })

                it('should fail on number partyup id (Delete partyup)', () => {
                    expect(() => logic.assistToPartyup(3)).to.throw(TypeError, '3 is not a string')
                })

                it('should fail on boolean partyup id (Delete partyup)', () => {
                    expect(() => logic.assistToPartyup(false)).to.throw(TypeError, 'false is not a string')
                })
            })


        })
        //COMMENT
        describe('Should create commentary', () => {

            let user, partyup, text

            beforeEach(async () => {
                name = `n-${Math.random()}`
                surname = `s-${Math.random()}`
                city = `c-${Math.random()}`
                username = `u-${Math.random()}`
                password = `p-${Math.random()}`
                text = "Test text testing text"

                user = await new User({ name, surname, city, username, password }).save()

                await logic.authenticateUser(username, password)

                partyup = await new Partyup({ title: "Search partyup by id", description: 'prueba en el test', date: new Date(), city: '01', place: 'skylab', tags: "01", user: user.id }).save()
            })

            it('should create comment', () => 
                logic.commentPartyup(partyup.id, text)
                    .then(() => {
                        return Commentary.find()
                            .then(comment => {
                                expect(comment[0].text).to.equal("Test text testing text")
                                expect(comment[0].partyup.toString()).to.equal(partyup.id)
                            })
                    })
            )

             //PARTYUP ID TEST FAIL//
            it('should fail on undefined partyup id (Create comment)', () => {
                expect(() => logic.commentPartyup(undefined, text)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty or blank partyup id (Create comment)', () => {
                expect(() => logic.commentPartyup(' ', text)).to.throw(Error, 'partyupId is empty or blank')
            })

            it('should fail on number partyup id (Create comment)', () => {
                expect(() => logic.commentPartyup(3, text)).to.throw(TypeError, '3 is not a string')
            })

            it('should fail on boolean partyup id (Create comment)', () => {
                expect(() => logic.commentPartyup(false, text)).to.throw(TypeError, 'false is not a string')
            })

             //TEXT ID TEST FAIL//
             it('should fail on undefined partyup id (Create comment)', () => {
                expect(() => logic.commentPartyup(partyup.id, undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty or blank partyup id (Create comment)', () => {
                expect(() => logic.commentPartyup(partyup.id, ' ')).to.throw(Error, 'comments is empty or blank')
            })

            it('should fail on number partyup id (Create comment)', () => {
                expect(() => logic.commentPartyup(partyup.id, 3)).to.throw(TypeError, '3 is not a string')
            })

            it('should fail on boolean partyup id (Create comment)', () => {
                expect(() => logic.commentPartyup(partyup.id, false)).to.throw(TypeError, 'false is not a string')
            })

        })

        //RETRIEVE COMMENT
        describe('Should retrieve commentary from partyup', () => {
            let user, partyup, comment

            beforeEach(async () => {
                name = `n-${Math.random()}`
                surname = `s-${Math.random()}`
                city = `c-${Math.random()}`
                username = `u-${Math.random()}`
                password = `p-${Math.random()}`

                user = await new User({ name, surname, city, username, password }).save()

                await logic.authenticateUser(username, password)

                partyup = await new Partyup({ title: "Search partyup by id", description: 'prueba en el test', date: new Date(), city: '01', place: 'skylab', tags: "01", user: user.id }).save()

                comment = await new Commentary({ user: user.id, partyup: partyup.id, text: "Test text testing text" }).save()
            })

            it('should retrieve comments', () =>
                logic.retrieveComments(partyup.id)
                    .then(comments => {
                        expect(comments).to.exist
                        expect(comments.length).to.equal(1)

                        const [comment] = comments

                        expect(comment.text).to.equal("Test text testing text")
                        expect(comment.partyup).to.equal(partyup.id)
                        expect(comment.user.id).to.equal(user.id)
                    })
            )

            it('should fail on undefined partyup id (retrieve comments)', () => {
                expect(() => logic.retrieveComments(undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty or blank partyup id (retrieve comments)', () => {
                expect(() => logic.retrieveComments(' ')).to.throw(Error, 'partyupId is empty or blank')
            })

            it('should fail on number partyup id (retrieve comments)', () => {
                expect(() => logic.retrieveComments(3)).to.throw(TypeError, '3 is not a string')
            })

            it('should fail on boolean partyup id (retrieve comments)', () => {
                expect(() => logic.retrieveComments(false)).to.throw(TypeError, 'false is not a string')
            })
        })

        //DELETE COMMENTS
        describe('Should delete commentary from partyup', () => {
            let user, partyup, comment

            beforeEach(async () => {
                name = `n-${Math.random()}`
                surname = `s-${Math.random()}`
                city = `c-${Math.random()}`
                username = `u-${Math.random()}`
                password = `p-${Math.random()}`

                user = await new User({ name, surname, city, username, password }).save()

                await logic.authenticateUser(username, password)

                partyup = await new Partyup({ title: "Search partyup by id", description: 'prueba en el test', date: new Date(), city: '01', place: 'skylab', tags: "01", user: user.id }).save()

                comment = await new Commentary({ user: user.id, partyup: partyup.id, text: "Test text testing text" }).save()
            })

            it('should succeed on correct data (delete comment)', () => 

                logic.retrieveComments(partyup.id)
                    .then(comments => {
                        expect(comments).to.exist
                        expect(comments.length).to.equal(1)

                        const [_comment] = comments

                        expect(_comment.text).to.equal("Test text testing text")
                        expect(_comment.partyup).to.equal(partyup.id)
                        expect(_comment.user.id).to.equal(user.id)

                        return logic.deleteComment(comment.id, partyup.id)
                            .then(res => {
                                expect(res.message).to.be.equal(`Comment ${comment.id} on partyup ${partyup.id} has been deleted with success!`)

                            })
                            .then(() => {
                                const __comment = Commentary.find()

                                expect(__comment.length).to.be.undefined

                                expect(__comment.user).to.be.undefined
                                expect(__comment.partyup).to.be.undefined
                                expect(__comment.text).to.be.undefined
                            })
                })
            )

            //COMMENT ID TEST FAIL//
            it('should fail on undefined comment id (Delete comments)', () => {
                expect(() => logic.deleteComment(undefined, partyup.id)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty or blank comment id (Delete comments)', () => {
                expect(() => logic.deleteComment(' ', partyup.id)).to.throw(Error, 'commentId is empty or blank')
            })

            it('should fail on number comment id (Delete comments)', () => {
                expect(() => logic.deleteComment(3, partyup.id)).to.throw(TypeError, '3 is not a string')
            })

            it('should fail on boolean comment id (Delete comments)', () => {
                expect(() => logic.deleteComment(false, partyup.id)).to.throw(TypeError, 'false is not a string')
            })

            //PARTYUP ID TEST FAIL//
            it('should fail on undefined user id (Delete comments)', () => {
                expect(() => logic.deleteComment(comment.id, undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty or blank user id (Delete comments)', () => {
                expect(() => logic.deleteComment(comment.id, ' ')).to.throw(Error, 'partyupId is empty or blank')
            })

            it('should fail on number user id (Delete comments)', () => {
                expect(() => logic.deleteComment(comment.id, 3)).to.throw(TypeError, '3 is not a string')
            })

            it('should fail on boolean user id (Delete comments)', () => {
                expect(() => logic.deleteComment(comment.id, false)).to.throw(TypeError, 'false is not a string')
            })

        })
    })
    after(() => mongoose.disconnect())
})