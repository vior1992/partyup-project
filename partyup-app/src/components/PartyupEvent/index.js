import React, { Component } from 'react'
import logic from '../../logic';
import Footer from '../Footer'
import HeaderLogged from '../HeaderLogged'
import './styles.css'

class PartyupEvent extends Component {
    state= { error: null, 
        date: '', 
        city: '',
        date: '',
        title: '', 
        user: '', 
        username: '', 
        description: '', 
        assistants: [], 
        usesersAssistants: [],
        actuallUserId: '',
        comment: [],
        commentaries: []
    }

    componentDidMount() {
        const partyupId = this.props.partyupId

        const actuallUserId = this.props.actuallUserId

        this.setState({ actuallUserId })

        logic.searchPartyupsById(partyupId)
            .then(partyup => {
                const { date, city, title, place, user, description, assistants} = partyup
                
                this.setState({ date, city, title, place, user, description, assistants })
            })

            .then(() => {
                logic.searchUserById(this.state.user)
                    .then(user => {
                        const { username } = user
                        this.setState({ username })
                    })
            })  

            .then(() => {
                this.state.assistants.forEach(assistant => {
                    logic.searchUserById(assistant)
                        .then(user => {
                            const oldAssistants = this.state.usesersAssistants

                            this.setState({ usesersAssistants: [...oldAssistants, [user.avatar, user.username, user.id]] })
                    })
                })
            })    
            .then(() => {
                logic.retrieveComments(partyupId)
                    .then(commentaries => {
                        this.setState({ commentaries }) 
                    })
            })            
    }
    
    handleYes(partyupId) {
        if (this.state.actuallUserId !== this.state.user) 

        try {
            let assistants = []
            let i = 0

            logic.assistToPartyup(partyupId)
                .then(partyAssistants => {
                    partyAssistants.partyup.assistants.forEach(() => {
                        assistants.push(partyAssistants.partyup.assistants[i])
                        this.setState({ assistants })
                        i ++
                    })
                })
                
                .then(() => {
                    let usesersAssistants = []
                    this.state.assistants.forEach(assistant => {
                        logic.searchUserById(assistant)
                            .then(user => {
                                
                                usesersAssistants.push([user.avatar, user.username, user.id])
                                this.setState({ usesersAssistants })
                            })
                    })  
                }) 

                .catch(err => this.setState({ error: err.message }))

        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleNo(partyupId) {
        if (this.state.actuallUserId !== this.state.user) 
        try {
            logic.notAssistToPartyup(partyupId)
                .then(partyAssistants => {
                    
                    partyAssistants.assistants.forEach(() => {
                    this.setState({ assistants: partyAssistants.assistants })
                    })
                })

                .then(() => {
                    let usesersAssistants = []
                    this.state.assistants.forEach(assistant => {
                        logic.searchUserById(assistant)
                            .then(user => {
                                usesersAssistants.push([user.avatar, user.username, user.id])
                                this.setState({ usesersAssistants })
                            })
                    })                 
                })

                .catch(err => this.setState({ error: err.message }))

        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleDelete(partyupId) {
        if (this.state.actuallUserId === this.state.user)
        
        try{
            logic.deletePartyup(partyupId)
                .then(() => {
                    this.props.onDeleteClick()
                })
                .catch(err => this.setState({ error: err.message }))

        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleCommentChange = event => {
        event.preventDefault()

        const comment = event.target.value

        this.setState({ comment })
    }

    handleSubmit(partyupId, userId) {
        const { comment } = this.state

        try{
            logic.commentPartyup(partyupId, comment)
                .then(() => {
                    logic.retrieveComments(partyupId)
                        .then(commentaries => {
                            this.setState({ commentaries })    
                        })
                })
                .then(() => {
                    const comment = ""
                    
                    this.setState({ comment })
                })
                .catch(err => this.setState({ error: err.message }))

        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleDeleteComment(commentId, partyupId){
        try{
            logic.deleteComment(commentId, partyupId)
                .then(() => {
                    logic.retrieveComments(partyupId)
                        .then(commentaries => {
                            this.setState({ commentaries })     
                        })
                })
                .catch(err => this.setState({ error: err.message }))

        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    render() {
        return <div>
            <div className="section"/>
            <HeaderLogged onLogoClick={this.props.onLogoClick} onCreatePartyupClick={this.props.onCreatePartyupClick} onProfileClick={this.props.onProfileClick} onLogoutClick={this.props.onLogoutClick} />
            
            <main className="partyup__container">
                <div className="partyups__items">
                    <div className="partyup__information">
                        <div className="information__content">
                            <div className="information__upsection">
                                <div>
                                    <h2>{this.state.title}</h2>
                                    <h4>Dia: {this.state.date.slice(0,10)}</h4>
                                    <h4>Ciudad: {this.state.city}</h4>
                                    <h4>Lugar de encuentro: {this.state.place}</h4>
                                    
                                    <h4>Anfitrion: {this.state.username}</h4>
                                </div>
                                <div>
                                    {this.state.user == this.state.actuallUserId ? 
                                        <button className="buttons__delete" onClick={() => this.handleDelete(this.props.partyupId)}>Eliminar</button> 
                                    :
                                    <div className="information__buttons">
                                        <h2>Asistir</h2>
                                        <div className="buttons__container">
                                            <button className="buttons__assist" onClick={() => this.handleYes(this.props.partyupId)}>Si</button>
                                            <button className="buttons__notassist" onClick={() => this.handleNo(this.props.partyupId)}>No</button>
                                        </div>
                                    </div>
                                    }
                                </div>  
                            </div>
                            <div className="information__downsection">
                                <h2>Descripcion</h2>
                                <p>{this.state.description}</p>
                            </div>
                        </div>
                    </div>
                    <div className="partyup__assistants">
                        <h2>Asistentes</h2>
                        <div className="assistants__list">
                            {this.state.usesersAssistants.map(assistant => <div className="assistant__info"> <img className="partyup__avatars" src={assistant[0]} onClick={() => this.props.onPublicProfileClick(assistant[2])}></img> <h2>{assistant[1]}</h2></div>)}
                        </div>
                    </div>
                    <div className="partyup__commentaries">
                        <h2>Comentarios</h2>
                        <form className="commentaries__formulary">
                            <textarea className="formulary__text" value={this.state.comment} type="text" placeholder="Max. 100 caracteres" maxlength="100" onChange={this.handleCommentChange}/>
                            <button className="formulary__button" onClick={() => this.handleSubmit(this.props.partyupId, this.props.actuallUserId)}>Enviar</button>
                        </form>
                        <ul className="commentaries__list">
                                {this.state.commentaries.map(comment => <li className="commentaries__info"><div className="comment__info"><img className="partyup__avatars" src={comment.user.avatar} onClick={() => this.props.onPublicProfileClick(comment.user.id)}></img><p className="info_text">{comment.text}</p></div> {comment.user.id == this.props.actuallUserId ? <button className="commentaries__deleteButton" onClick={() => this.handleDeleteComment(comment.id, comment.partyup)}>Borrar</button> : "" }</li>  )}
                        </ul>
                    </div>
                </div>
            </main>

            <Footer/>
        </div>
    }
}

export default PartyupEvent