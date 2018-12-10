import React, { Component } from 'react'
import logic from '../../logic'
import ItemListPartyups from '../ItemListPartyups'
import CitySelector from '../CitySelector'
import TagSelector from '../TagSelector'
import HeaderLogged from '../HeaderLogged'
import Footer from '../Footer'
import './styles.css'


class Home extends Component {
    state = { error: null, allPartyups: [], searchedPartyups: [], city: "", tags: "", actuallUserId: ''}

    componentWillMount() {
        logic.retrieveLoggedUser()
            .then(user => {
                const { id } = user

                const actuallUserId = id
                
                this.setState({ actuallUserId })
                
                this.props.onUserLoggedId(id)
            })
    }

    componentDidMount() {
        logic.listPartyups()
            .then(partyups => {
                partyups.forEach(() => {
                    this.setState({ allPartyups: partyups })
                })
            })        
    }

    handleCityChange = event => {
        let city = event.target.value

        this.setState({ city })
    }

    handleTagsChange = event => {
        let tags = event.target.value

        this.setState({ tags })
    }

    handleSubmit = event => {
        event.preventDefault()

        let { city, tags } = this.state

        this.handleSearchPartyups(city, tags)
    } 

    handleSearchPartyups = (city, tags) => {
        try {
            if(city && tags){
                logic.searchPartyups(city, tags)
                    .then(partyups => {
                        if (partyups.length == 0) {
                            this.setState({ searchedPartyups: '' })

                        } else {
                            partyups.forEach(() => {
                                this.setState({ searchedPartyups: partyups })
                            })
                        }
                    })
                    .catch(err => this.setState({ error: err.message }))

            } else if(city && !tags){
                logic.searchPartyups(city, undefined)
                    .then(partyups => {
                        if (partyups.length == 0) {
                            this.setState({ searchedPartyups: '' })
                        } else {
                            partyups.forEach(() => {
                                this.setState({ searchedPartyups: partyups })
                            })
                        }
                    })
                    .catch(err => this.setState({ error: err.message }))

            } else if(!city && tags){
                logic.searchPartyups(undefined, tags)
                    .then(partyups => {
                        if (partyups.length == 0) {
                            this.setState({ searchedPartyups: '' })
                        } else {
                            partyups.forEach(() => {
                                this.setState({ searchedPartyups: partyups })
                            })
                        }
                    })
                    .catch(err => this.setState({ error: err.message }))
                    
            } else if(!city && !tags){
                logic.searchPartyups(undefined, undefined)
                    .then(partyups => {
                        if (partyups.length == 0) {
                            this.setState({ searchedPartyups: '' })
                        } else {
                            partyups.forEach(() => {
                                this.setState({ searchedPartyups: partyups })
                            })
                        }
                    })
                    .catch(err => this.setState({ error: err.message }))
            }
                
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    render() {
        return <div>
            <HeaderLogged onLogoClick={this.props.onLogoClick} onCreatePartyupClick={this.props.onCreatePartyupClick} onProfileClick={this.props.onProfileClick} onLogoutClick={this.props.onLogoutClick} />
            <section>
                <div className="main__gifsection">
                    <div className="main__container">
                        <div className="main_titles">
                            <h2 className="title__h2">¿Quieres fiesta?</h2>
                            <h4 className="title__h4">Encuentrala con Partyup</h4>
                            <div className="main__selectors">
                                <CitySelector onHandleCityChange={this.handleCityChange}/>
                                <TagSelector onHandleTagsChange={this.handleTagsChange}/>
                            </div>
                            <button className="search__button" onClick={this.handleSubmit}>Buscar</button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="partyups">
                {this.state.searchedPartyups.length ?
                <div>
                    <div className="partyups__titles">
                        <h1>Resultados de la busqueda:</h1>
                    </div>
                
                    <div className="partyups__container">
                        <div className="container__list"> {this.state.searchedPartyups.map(partyup => <ItemListPartyups key={partyup.id} id={partyup.id} title={partyup.title} place={partyup.place} date={partyup.date} assistants={partyup.assistants} picture={partyup.picture} actuallUserId={this.state.actuallUserId} onPartyupClick={this.props.onPartyupClick}/>)} </div>
                    </div>
                </div>
                : ""}
                
                <div className="partyups__titles">
                    <h1>Proximos Partyups</h1>
                </div>
                <div>
                    <div className="partyups__container">
                        <div className="container__list"> {this.state.allPartyups.map(partyup => <ItemListPartyups key={partyup.id} id={partyup.id} title={partyup.title} place={partyup.place} date={partyup.date} assistants={partyup.assistants} picture={partyup.picture} actuallUserId={this.state.actuallUserId} onPartyupClick={this.props.onPartyupClick}/>)} </div>
                    </div>
                </div>
            </section> 
            <Footer/>
        </div>
    }
}

export default Home
