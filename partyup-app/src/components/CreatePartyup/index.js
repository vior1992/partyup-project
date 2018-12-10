import React, { Component } from 'react'
import logic from '../../logic'
import CitySelector from '../CitySelector'
import TagSelector from '../TagSelector'
import Footer from '../Footer'
import HeaderLogged from '../HeaderLogged'
import FileBase64 from 'react-file-base64'
import * as moment from 'moment'
import ReactLoading from 'react-loading'
import './styles.css'

class CreatePartyup extends Component {
    state = { 
        title: "", 
        description: "", 
        date: "", 
        city: "", 
        place: "", 
        tags: "",
        picture: "",
        loading: false,
        error: null
    }

    handleTitleChange = event => {
        const title = event.target.value

        this.setState({ title })
    }

    handleDescriptionChange = event => {
        const description = event.target.value

        this.setState({ description })
    }

    handleDateChange = event => {
        const date = event.target.value

        this.setState({ date })
    }

    handleCityChange = event => {
        const city = event.target.value

        this.setState({ city })
    }

    handlePlaceChange = event => {
        const place = event.target.value

        this.setState({ place })
    }

    handleTagsChange = event => {
        const tags = event.target.value

        this.setState({ tags })
    }

    getFiles = files => {
        this.setState({
            loading: true
        }, () => this.handlePictureChange(files.base64))
    }

    handlePictureChange(base64Image){
        logic.addPartyupPicture(base64Image)
            .then(picture => {
                this.setState({
                    picture,
                    loading: false,
                })
            })
            .catch(err => this.setState({ error: err.message, loading: false}))
    }

    handleSubmit = async event => {
        event.preventDefault()
        
        if (!this.state.picture.trim().length) {

            const picture = "https://cps-static.rovicorp.com/3/JPG_500/MI0003/752/MI0003752888.jpg?partner=allrovi.com"
            
            this.setState({ picture }, () => {
                
            const { title, description, date, city, place, tags, picture } = this.state

            this.props.onCreatePartyup(title, description, new Date(date), city, place, tags, picture)
            })

        } else if (!this.state.loading) {
            const { title, description, date, city, place, tags, picture } = this.state

            this.props.onCreatePartyup(title, description, new Date(date), city, place, tags, picture)
        }
    } 

    render() {
        let now = moment().format('YYYY-MM-DD');

        return <div>
            <HeaderLogged onLogoClick={this.props.onLogoClick} onCreatePartyupClick={this.props.onCreatePartyupClick} onProfileClick={this.props.onProfileClick} onLogoutClick={this.props.onLogoutClick} />
    
            <div className="create__container">
                <form className="create__formulary" action="">
                    <h4>¿Como se llamara tu PartyUp?</h4>
                    <input className="create__input" type="text" maxlength="22" placeholder="Max. 22 caracteres" onChange={this.handleTitleChange}/>
                    <h4>Describelo un poco</h4>
                    <textarea className="create__textarea" placeholder="Donde ireis, que esperas de los asistentes, si hay que llevar algo... Max. 288 caracteres" maxlength="288" onChange={this.handleDescriptionChange} cols="5" rows="5"></textarea>
                    <h4>Punto de encuentro</h4>
                    <input className="create__input" placeholder="Un bar, una plaza, una calle... Max. 25 caracteres" type="text" maxlength="25" onChange={this.handlePlaceChange}/>
                    <h4>Dia del Partyup</h4>
                    <input type="date" type="date" name="partyup" min={now} onChange={this.handleDateChange}></input>
                </form>
            <div className="create__selects">
                <div className="select__city">
                    <h4>Ciudad</h4>
                    <CitySelector onHandleCityChange={this.handleCityChange}/>
                </div>
                <div className="select__tags">
                    <h4>Tag</h4>
                    <TagSelector onHandleTagsChange={this.handleTagsChange}/>
                </div>
            </div>
                <div className="create__photo">
                    <h4>Foto</h4>
                    <FileBase64 className="input" multiple={false} onDone={this.getFiles} />
                    {this.state.loading ? <ReactLoading type="spin" color="#d20096" className="spinner"/> : ""} 
                </div>
                <div>
                    {this.props.error ? <h3 className="register__error">{this.props.error}</h3> : "" }
                </div>
                <button className="create__button" onClick={this.handleSubmit}>Crear Partyup</button>
            </div>
            
            <Footer/>
        </div>
    }
}

export default CreatePartyup