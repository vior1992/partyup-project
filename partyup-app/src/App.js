import React, { Component } from 'react'
import { Route, Redirect, withRouter } from 'react-router'
import logic from './logic'
import Landing from './components/Landing'
import Register from './components/Register'
import Login from './components/Login'
import Home from './components/Home'
import CreatePartyup from './components/CreatePartyup'
import Profile from './components/Profile'
import PublicProfile from './components/PublicProfile'
import PartyupEvent from './components/PartyupEvent'

logic.url = process.env.REACT_APP_API_URL

class App extends Component {
  state = { 
    error: null, 
    partyupId: '' , 
    _actuallUserId: '', 
    userLoggedId: ''
  }

  handlerRouter = (event, route) =>  {
    if (event) event.preventDefault()

    if (route === '') logic.logout()

    this.props.history.push(`/${route}`)

    this.setState({ error: null })
  }

  handleUserLoggedId = (id) => this.setState({ userLoggedId: id })
  
  handlePartyupClick = (id, actuallUserId) => {
    this.setState({ 
      partyupId: id, 
      actuallUserId: actuallUserId, 
      error: null 
    })

    this.props.history.push(`/user/${this.state.userLoggedId}/partyup/${id}`)  
  }

  handlePublicProfileClick = (userId) => {
    this.props.history.push(`/profile/public/${userId}`)

    this.setState({ error: null })
  }

  handleRegister = (name, surname, city, username, password) => {
    try {
      logic.registerUser(name, surname, city, username, password)
            .then(() => {
                this.setState({ error: null }, () => this.props.history.push('/login'))
            })
            .catch(err => this.setState({ error: err.message }))
    } catch (err) {
        this.setState({ error: err.message })
    }
  }

  handleLogin = (username, password) =>  {
    try {
        logic.authenticateUser(username, password)
            .then(() => {
                this.setState({ error: null }, () => this.props.history.push('/home'))
            })
            .catch(err => this.setState({ error: err.message }))
    } catch (err) {
        this.setState({ error: err.message })
    }
  }

  handleCreatePartyup = (title, description, date, city, place, tags, picture) => {
    try {
        logic.createPartyup(title, description, date, city, place, tags, picture)
            .then(() => {
                this.setState({ error: null }, () => this.props.history.push('/home'))
            })
            .catch(err => this.setState({ error: err.message }))
    } catch (err) {
        this.setState({ error: err.message })
    }
  }

  render() {    
        const customProps = {
          onRegisterClick: (event) => this.handlerRouter(event, 'register'),
          onLoginClick: (event) => this.handlerRouter(event, 'login'),
          onLogoClick: (event) => this.handlerRouter(event, 'home'),
          onCreatePartyupClick: (event) => this.handlerRouter(event, 'create-partyup'),
          onProfileClick: (event) => this.handlerRouter(event, 'profile'),
          onLogoutClick: (event) => this.handlerRouter(event, ''),
          onPartyupClickNotLogged: (event) => this.handlerRouter(event, 'login'),
          onUserLoggedId: this.handleUserLoggedId,
          onPartyupClick: this.handlePartyupClick,
          onRegister: this.handleRegister,
          onLogin: this.handleLogin,
          onCreateClick: this.handleCreateClick,
          onCreatePartyup: this.handleCreatePartyup, 
          onPublicProfileClick: this.handlePublicProfileClick,
          error: this.state.error
        }    

        return <div>
          <Route exact path="/" render={() => 
            !logic.loggedIn ? <Landing {...customProps}/>
            : <Redirect to="/home" />} 
          />
          <Route path="/home" render={() => 
            logic.loggedIn ? <Home {...customProps}/>
            : <Redirect to="/" />} 
          />
          <Route path="/register" render={() => 
            !logic.loggedIn ? <Register {...customProps}/> 
            : <Redirect to="/home" />} 
          />
          <Route path="/login" render={() => 
            !logic.loggedIn ? <Login {...customProps}/> 
            : <Redirect to="/home" />}
          />
          <Route path="/create-partyup" render={() => 
            logic.loggedIn ? <CreatePartyup {...customProps}/> 
            : <Redirect to="/" />}
          />
          <Route exact path="/profile" render={() => 
            logic.loggedIn ? <Profile 
              onDeleteClick={(event) => this.handlerRouter(event, '')}               
              {...customProps}/>
            : <Redirect to="/" />}
          />
          <Route path="/profile/public/:userId" render={props => 
            logic.loggedIn ? <PublicProfile 
              userId={props.match.params.userId} 
              {...customProps}/> 
            : <Redirect to="/" />} 
          />
          <Route path="/user/:userLoggedId/partyup/:partyupId" render={props => 
            logic.loggedIn ? <PartyupEvent 
              partyupId={props.match.params.partyupId} 
              actuallUserId={props.match.params.userLoggedId} 
              onDeleteClick={(event) => this.handlerRouter(event, 'home')} 
              {...customProps}/>
            : <Redirect to="/" />}
          />
        </div>
  }
}

export default withRouter(App);
