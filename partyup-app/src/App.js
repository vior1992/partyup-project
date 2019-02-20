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

    this.props.history.push(`/${route}`)

    this.setState({ error: null })
  }

  handleUserLoggedId = (id) => {
    const userLoggedId = id

    this.setState({ userLoggedId })
  }

  handleDeleteUserClick = () => {  
    logic.logout()

    this.props.history.push('/')

    this.setState({ error: null })
  }

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

  handleLogoutClick = event => {
    event.preventDefault()

    logic.logout()

    this.props.history.push('/')

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
        return <div>
          <Route exact path="/" render={() => 
            !logic.loggedIn ? <Landing 
              onRegisterClick={(event) => this.handlerRouter(event, 'register')} 
              onLoginClick={(event) => this.handlerRouter(event, 'login')} 
              onLogoClick={(event) => this.handlerRouter(event, 'home')} 
              onPartyupClickNotLogged={(event) => this.handlerRouter(event, 'login')}/>
            : <Redirect to="/home" />} 
          />
          <Route path="/home" render={() => 
            logic.loggedIn ? <Home 
              onUserLoggedId={this.handleUserLoggedId} 
              onLogoClick={(event) => this.handlerRouter(event, 'home')} 
              onPartyupClick={this.handlePartyupClick} 
              onCreatePartyupClick={(event) => this.handlerRouter(event, 'create-partyup')} 
              onProfileClick={(event) => this.handlerRouter(event, 'profile')} 
              onLogoutClick={this.handleLogoutClick} /> 
            : <Redirect to="/" />} 
          />
          <Route path="/register" render={() => 
            !logic.loggedIn ? <Register 
              onRegister={this.handleRegister} 
              onRegisterClick={(event) => this.handlerRouter(event, 'register')} 
              onLoginClick={(event) => this.handlerRouter(event, 'login')} 
              onLogoClick={(event) => this.handlerRouter(event, 'home')} 
              error={this.state.error}/> 
            : <Redirect to="/home" />} 
          />
          <Route path="/login" render={() => 
            !logic.loggedIn ? <Login 
              onLogin={this.handleLogin} 
              onRegisterClick={(event) => this.handlerRouter(event, 'register')} 
              onLoginClick={(event) => this.handlerRouter(event, 'login')} 
              onLogoClick={(event) => this.handlerRouter(event, 'home')} 
              error={this.state.error}/> 
            : <Redirect to="/home" />}
          />
          <Route path="/create-partyup" render={() => 
            logic.loggedIn ? <CreatePartyup 
              onCreateClick={this.handleCreateClick} 
              onCreatePartyup={this.handleCreatePartyup} 
              onCreatePartyupClick={(event) => this.handlerPrueba(event, 'create-partyup')} 
              onProfileClick={(event) => this.handlerPrueba(event, 'profile')} 
              onLogoutClick={this.handleLogoutClick} 
              error={this.state.error}/> 
            : <Redirect to="/" />}
          />
          <Route exact path="/profile" render={() => 
            logic.loggedIn ? <Profile 
              onPartyupClick={this.handlePartyupClick} 
              onCreatePartyupClick={(event) => this.handlerPrueba(event, 'create-partyup')} 
              onProfileClick={(event) => this.handlerPrueba(event, 'profile')} 
              onLogoutClick={this.handleLogoutClick} 
              onDeleteClick={this.handleDeleteUserClick}/> 
            : <Redirect to="/" />}
          />
          <Route path="/profile/public/:userId" render={props => 
            logic.loggedIn ? <PublicProfile 
              userId={props.match.params.userId} 
              onPartyupClick={this.handlePartyupClick} 
              onCreatePartyupClick={(event) => this.handlerPrueba(event, 'create-partyup')} 
              onProfileClick={(event) => this.handlerPrueba(event, 'profile')} 
              onLogoutClick={this.handleLogoutClick} /> 
            : <Redirect to="/" />} 
          />
          <Route path="/user/:userLoggedId/partyup/:partyupId" render={props => 
            logic.loggedIn ? <PartyupEvent 
              partyupId={props.match.params.partyupId} 
              actuallUserId={props.match.params.userLoggedId} 
              onPublicProfileClick={this.handlePublicProfileClick} 
              onDeleteClick={(event) => this.handlerPrueba(event, 'home')} 
              onCreatePartyupClick={(event) => this.handlerPrueba(event, 'create-partyup')} 
              onProfileClick={(event) => this.handlerPrueba(event, 'profile')} 
              onLogoutClick={this.handleLogoutClick}/> 
            : <Redirect to="/" />}
          />
        </div>
  }
}

export default withRouter(App);
