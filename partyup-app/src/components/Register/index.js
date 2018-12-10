import React, { Component } from 'react'
import Footer from '../Footer'
import HeaderNotLogged from '../HeaderNotLogged'
import './styles.css'

class Register extends Component {
    state = { name: '', surname: '', city: '', username: '', password: ''}

    handleNameChange = event => {
        const name = event.target.value

        this.setState({ name })
    }

    handleSurnameChange = event => {
        const surname = event.target.value

        this.setState({ surname })
    }

    handleCityChange = event => {
        const city = event.target.value

        this.setState({ city })
    }

    handleUsernameChange = event => {
        const username = event.target.value

        this.setState({ username })
    }

    handlePasswordChange = event => {
        const password = event.target.value

        this.setState({ password })
    }

    handleSubmit = event => {
        event.preventDefault()

        const { name, surname, city, username, password } = this.state

        this.props.onRegister(name, surname, city, username, password)
    }

    render(){
        return <div>
        <HeaderNotLogged onLogoClick={this.props.onLogoClick} onLoginClick={this.props.onLoginClick} onRegisterClick={this.props.onRegisterClick}/>

        <div className="register__background"/>
        <div className="register__container">
            <div className="register__titles">
                <h2>Registrarse</h2>
                <p>¿Ya eres miembro? <a className="register__ancor" href="#" onClick={this.props.onLoginClick}>Iniciar sesión</a></p>
            </div>
            <div className="register__formulary">
                <form className="formulary__container">
                        <h3 className="formulary__titles" >Nombre</h3>
                        <input className="formulary__input" type="text" maxlength="22" onChange={this.handleNameChange}/>
                        <h3 className="formulary__titles" >Apellidos</h3>
                        <input className="formulary__input" type="text" maxlength="22" onChange={this.handleSurnameChange}/>
                        <h3 className="formulary__titles" >Ciudad</h3>
                        <select defaultValue="CHOOSE" name="city" id="" onChange={this.handleCityChange}>
                            <option value="CHOOSE">Elige una ciudad</option>
                            <option value="Barcelona">Barcelona</option>
                            <option value="Madrid">Madrid</option>
                            <option value="Bilbao">Bilbao</option>
                            <option value="Valencia">Valencia</option>
                            <option value="Sevilla">Sevilla</option>
                        </select>
                        <h3 className="formulary__titles" >Nombre de usuario</h3>
                        <input className="formulary__input" type="text" maxlength="22" onChange={this.handleUsernameChange}/>
                        <h3 className="formulary__titles" >Contraseña</h3>
                        <input className="formulary__input" type="password" maxlength="22" onChange={this.handlePasswordChange}/>
                </form>
            </div>
            <div>
                {this.props.error ? <h3 className="register__error">{this.props.error}</h3> : "" }
            </div>
            <button className="register__button" onClick={this.handleSubmit}>Registrarse</button>
        </div>
        
        <Footer/>
    </div>
        
    }
}

export default Register