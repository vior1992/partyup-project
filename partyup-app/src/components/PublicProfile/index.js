import React, { Component } from 'react'
import logic from '../../logic'
import ItemListPartyups from '../ItemListPartyups'
import Footer from '../Footer'
import HeaderLogged from '../HeaderLogged'
import './styles.css'

class PublicProfile extends Component {
    state = { 
        name: '', 
        surname: '', 
        username: '', 
        city: '', 
        id: '', 
        avatar:  '',
        createdPartyups: [], 
        willAssistTo:[],
    }

    componentDidMount() {
        const userId = this.props.userId
        
        logic.searchUserById(userId)
            .then(user => {
                const { name, surname, username, city, id, avatar } = user
                
                this.setState({ name, surname, username, city, id, avatar })
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
                            this.setState({ searchedPartyups: '' })
                        } else {
                            partyups.forEach(() => {
                                this.setState({ willAssistTo: partyups })
                            }) 
                        }  
                    })
            })
    }
    
    render() {
        return <div>
            <HeaderLogged onLogoClick={this.props.onLogoClick} onCreatePartyupClick={this.props.onCreatePartyupClick} onProfileClick={this.props.onProfileClick} onLogoutClick={this.props.onLogoutClick} />

            <main className="publicProfile">
                <div className="publicProfile__information">
                    <div className="information__picture">
                        {this.state.avatar ? <img className="profile__avatar" src={this.state.avatar}></img> : <img className="profile__avatar" src="./images/profile.png"></img>}
                    </div>
                    <div className="information__text">
                        <h2>{this.state.username}</h2>
                        <h4>Nombre: {this.state.name} {this.state.surname}</h4>
                        <h4>Ciudad: {this.state.city}</h4>
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
                : ""}
                {this.state.willAssistTo ? 
                <div className="partyups">
                    <div  className="partyups__titles">
                        <h2>Asistira a</h2>
                    </div>
                    <div className="partyups__container">
                        <div className="container__list"> {this.state.willAssistTo.map(partyup => <ItemListPartyups key={partyup.id} id={partyup.id} title={partyup.title} place={partyup.place} date={partyup.date} assistants={partyup.assistants} picture={partyup.picture} actuallUserId={this.state.id} onPartyupClick={this.props.onPartyupClick}/>)} </div>
                    </div>
                </div>
                : ""}
            </main>
            
            <Footer/>
        </div>
    }
}

export default PublicProfile