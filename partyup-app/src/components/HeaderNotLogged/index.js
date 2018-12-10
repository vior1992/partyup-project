import React from 'react'
import './styles.css'


function headerNotLogged(props){
    return <div>
            <header className="site__header">
                <a href="#" className="logo" onClick={props.onLogoClick}>Logo</a>
                
                <div className="header__actions">
                    <a href="#" className="login__link" onClick={props.onLoginClick}>Iniciar sesión</a>
                    <a href="#" className="logup__link" onClick={props.onRegisterClick}>Registrarse</a>
                </div>
            </header>
    </div>

}

export default headerNotLogged