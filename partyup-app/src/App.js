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

  handleUserLoggedId = (id) => {
    const userLoggedId = id

    this.setState({ userLoggedId })
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
        const headerNotLoggedProps = {
          onRegisterClick: (event) => this.handlerRouter(event, 'register'),
          onLoginClick: (event) => this.handlerRouter(event, 'login'),
          onLogoClick: (event) => this.handlerRouter(event, 'home')
        }    

        const headerLoggedProps = {
          onCreatePartyupClick: (event) => this.handlerRouter(event, 'create-partyup'),
          onProfileClick: (event) => this.handlerRouter(event, 'profile'),
          onLogoutClick: (event) => this.handlerRouter(event, '')
        }    

        return <div>
          <Route exact path="/" render={() => 
            !logic.loggedIn ? <Landing 
              onPartyupClickNotLogged={(event) => this.handlerRouter(event, 'login')}
              {...headerNotLoggedProps}/>
            : <Redirect to="/home" />} 
          />
          <Route path="/home" render={() => 
            logic.loggedIn ? <Home 
              onUserLoggedId={this.handleUserLoggedId} 
              onPartyupClick={this.handlePartyupClick} 
              onLogoClick={(event) => this.handlerRouter(event, 'home')} 
              {...headerLoggedProps}/>
            : <Redirect to="/" />} 
          />
          <Route path="/register" render={() => 
            !logic.loggedIn ? <Register 
              onRegister={this.handleRegister}
              error={this.state.error}
              {...headerNotLoggedProps}/> 
            : <Redirect to="/home" />} 
          />
          <Route path="/login" render={() => 
            !logic.loggedIn ? <Login 
              onLogin={this.handleLogin} 
              error={this.state.error}
              {...headerNotLoggedProps}/> 
            : <Redirect to="/home" />}
          />
          <Route path="/create-partyup" render={() => 
            logic.loggedIn ? <CreatePartyup 
              onCreateClick={this.handleCreateClick} 
              onCreatePartyup={this.handleCreatePartyup} 
              error={this.state.error}
              {...headerLoggedProps}/> 
            : <Redirect to="/" />}
          />
          <Route exact path="/profile" render={() => 
            logic.loggedIn ? <Profile 
              onPartyupClick={this.handlePartyupClick} 
              onDeleteClick={(event) => this.handlerRouter(event, '')}               
              {...headerLoggedProps}/>
            : <Redirect to="/" />}
          />
          <Route path="/profile/public/:userId" render={props => 
            logic.loggedIn ? <PublicProfile 
              userId={props.match.params.userId} 
              onPartyupClick={this.handlePartyupClick} 
              {...headerLoggedProps}/> 
            : <Redirect to="/" />} 
          />
          <Route path="/user/:userLoggedId/partyup/:partyupId" render={props => 
            logic.loggedIn ? <PartyupEvent 
              partyupId={props.match.params.partyupId} 
              actuallUserId={props.match.params.userLoggedId} 
              onPublicProfileClick={this.handlePublicProfileClick} 
              onDeleteClick={(event) => this.handlerRouter(event, 'home')} 
              {...headerLoggedProps}/>
            : <Redirect to="/" />}
          />
        </div>
  }
}

export default withRouter(App);
