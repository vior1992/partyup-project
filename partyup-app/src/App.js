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
  state = { error: null, partyupId: '' , _actuallUserId: '', userLoggedId: ''}

  handleRegisterClick = event => {
    event.preventDefault()

    this.props.history.push('/register')

    this.setState({ error: null })
  }

  handleLoginClick = event => {
    event.preventDefault()

    this.props.history.push('/login')

    this.setState({ error: null })
  }

  handleUserLoggedId = (id) => {
    const userLoggedId = id

    this.setState({ userLoggedId })
  }

  handleDeletePostClick = () => {    
    this.props.history.push('/home')

    this.setState({ error: null })
  }

  handleDeleteUserClick = () => {  
    logic.logout()

    this.props.history.push('/')

    this.setState({ error: null })
  }

  handleLogoClick = event => {
    event.preventDefault()

    this.props.history.push('/home')

    this.setState({ error: null })
  }

  handlePartyupClickNotLogged = () => {
    this.props.history.push('/login')

    this.setState({ error: null })
  }

  handlePartyupClick = (id, actuallUserId) => {
    const partyupId = id

    const _actuallUserId = actuallUserId

    this.setState({ partyupId, _actuallUserId, error: null })

    this.props.history.push(`/user/${this.state.userLoggedId}/partyup/${partyupId}`)  
  }

  handleCreatePartyUpClick = event => {
    event.preventDefault()

    this.props.history.push('/create-partyup')

    this.setState({ error: null })
  }

  handleProfileClick = event => {
    event.preventDefault()

    this.props.history.push('/profile')

    this.setState({ error: null })
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
          <Route exact path="/" render={() => !logic.loggedIn ? <Landing onRegisterClick={this.handleRegisterClick} onLoginClick={this.handleLoginClick} onLogoClick={this.handleLogoClick} onPartyupClickNotLogged={this.handlePartyupClickNotLogged}/> : <Redirect to="/home" />} />
          <Route path="/home" render={() => logic.loggedIn ? <Home onUserLoggedId={this.handleUserLoggedId} onLogoClick={this.handleLogoClick} onPartyupClick={this.handlePartyupClick} onCreatePartyupClick={this.handleCreatePartyUpClick} onProfileClick={this.handleProfileClick} onLogoutClick={this.handleLogoutClick} /> : <Redirect to="/" />} />
          <Route path="/register" render={() => !logic.loggedIn ? <Register onRegister={this.handleRegister} onRegisterClick={this.handleRegisterClick} onLoginClick={this.handleLoginClick} onLogoClick={this.handleLogoClick} error={this.state.error}/> : <Redirect to="/home" />} />
          <Route path="/login" render={() => !logic.loggedIn ? <Login onLogin={this.handleLogin} onRegisterClick={this.handleRegisterClick} onLoginClick={this.handleLoginClick} onLogoClick={this.handleLogoClick} error={this.state.error}/> : <Redirect to="/home" />}/>
          <Route path="/create-partyup" render={() => logic.loggedIn ? <CreatePartyup onCreateClick={this.handleCreateClick} onCreatePartyup={this.handleCreatePartyup} onCreatePartyupClick={this.handleCreatePartyUpClick} onProfileClick={this.handleProfileClick} onLogoutClick={this.handleLogoutClick} error={this.state.error}/> : <Redirect to="/" />}/>
          <Route exact path="/profile" render={() => logic.loggedIn ? <Profile onPartyupClick={this.handlePartyupClick} onCreatePartyupClick={this.handleCreatePartyUpClick} onProfileClick={this.handleProfileClick} onLogoutClick={this.handleLogoutClick} onDeleteClick={this.handleDeleteUserClick}/> : <Redirect to="/" />}/>
          <Route path="/profile/public/:userId" render={props => logic.loggedIn ? <PublicProfile userId={props.match.params.userId} onPartyupClick={this.handlePartyupClick} onCreatePartyupClick={this.handleCreatePartyUpClick} onProfileClick={this.handleProfileClick} onLogoutClick={this.handleLogoutClick} /> : <Redirect to="/" />} />
          <Route path="/user/:userLoggedId/partyup/:partyupId" render={props => logic.loggedIn ? <PartyupEvent partyupId={props.match.params.partyupId} actuallUserId={props.match.params.userLoggedId} onPublicProfileClick={this.handlePublicProfileClick} onDeleteClick={this.handleDeletePostClick} onCreatePartyupClick={this.handleCreatePartyUpClick} onProfileClick={this.handleProfileClick} onLogoutClick={this.handleLogoutClick}/> : <Redirect to="/" />}/>
        </div>
  }
}

export default withRouter(App);
