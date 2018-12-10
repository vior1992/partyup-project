import React, { Component } from 'react'
import logic from '../../logic'
import ItemListPartyups from '../ItemListPartyups'
import Footer from '../Footer'
import HeaderLogged from '../HeaderLogged'
import FileBase64 from 'react-file-base64'
import ReactLoading from 'react-loading'

import './styles.css'

class Profile extends Component {
    state = { 
        name: '', 
        surname: '', 
        username: '', 
        city: '', 
        id: '', 
        avatar:  '',
        createdPartyups: [], 
        willAssistTo:[],
        loading: false
    }

    componentDidMount() {        
        logic.retrieveLoggedUser()
            .then(user => {
                const { name, surname, city, username, id, avatar } = user
                this.setState({ name, surname, city, username, id, avatar })
            })
            .then(() => {
                logic.itemListPartyupsCreatedBy(this.state.id)
                    .then(partyups => {
                        if (partyups.length == 0) {
                            this.setState({ createdPartyups: '' })
                        } else {
                            partyups.forEach(() => {   
                                this.setState({ createdPartyups: partyups })
                            })  
                        }
                    })   
            })
            .then(() => {
                logic.itemListPartyupsIAssist(this.state.id)
                    .then(partyups => {
                        if (partyups.length == 0) {
                            this.setState({ willAssistTo: '' })
                        } else {
                            partyups.forEach(() => {
                                this.setState({ willAssistTo: partyups })
                            }) 
                        }  
                    })
            })
    }

    handleDelete() {
        logic.deleteUser()
    }

    getFiles = files => {
        this.setState({
            loading: true
        })
        this.handleAvatarChange(files.base64)
    }

    handleAvatarChange(base64Image){
        logic.addUserAvatar(base64Image)
            .then(avatar => {
                this.setState({
                    avatar,
                    loading: false,
                })                
            })
            .catch(err => this.setState({ error: err.message, loading: false }))
    }
    
    render() {
        return <div>
            <HeaderLogged onLogoClick={this.props.onLogoClick} onCreatePartyupClick={this.props.onCreatePartyupClick} onProfileClick={this.props.onProfileClick} onLogoutClick={this.props.onLogoutClick} />

            <main className="profile">
                <div className="profile__information">
                    <div className="information__picture">
                        <div>
                            {this.state.avatar ? <img className="profile__avatar" src={this.state.avatar}></img> : <img className="profile__avatar" src="./images/profile.png"></img>}
                        </div>
                        <div className="picture__input">
                            <FileBase64 className="input" multiple={false} onDone={this.getFiles} />
                            {this.state.loading ? <ReactLoading type="spin" color="#d20096" className="spinner"/> : ""}          
                        </div>
                    </div>
                    <div className="information__text">
                        <h2>{this.state.username}</h2>
                        <h4>Nombre: {this.state.name} {this.state.surname}</h4>
                        <h4>Ciudad: {this.state.city}</h4>
                    </div>
                    <div className="profile_delete">
                        <button className="profile__delete--button" onClick={() => { this.handleDelete(); this.props.onDeleteClick() }}>Eliminar perfil</button>
                    </div>
                </div>
                {this.state.createdPartyups ? 
                <div className="partyups" >
                    <div className="partyups__titles">
                        <h2>Eventos creados</h2> 
                    </div>
                    <div className="partyups__container">
                        <div className="container__list"> {this.state.createdPartyups.map(partyup => <ItemListPartyups key={partyup.id} id={partyup.id} title={partyup.title} place={partyup.place} date={partyup.date} assistants={partyup.assistants} picture={partyup.picture} actuallUserId={this.state.id} onPartyupClick={this.props.onPartyupClick}/>)} </div>
                    </div>
                </div>
                : "" }
                {this.state.willAssistTo ? 
                <div className="partyups">
                    <div className="partyups__titles">
                        <h2>Asistira a</h2>
                    </div>
                    <div className="partyups__container">
                        <div className="container__list"> {this.state.willAssistTo.map(partyup => <ItemListPartyups key={partyup.id} id={partyup.id} title={partyup.title} place={partyup.place} date={partyup.date} assistants={partyup.assistants} picture={partyup.picture} actuallUserId={this.state.id} onPartyupClick={this.props.onPartyupClick}/>)} </div>
                    </div>
                </div>
                : '' }
            </main>
            
            <Footer/>
        </div>
    }
}

export default Profile