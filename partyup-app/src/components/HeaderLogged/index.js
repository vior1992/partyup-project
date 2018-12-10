import React from 'react'
import './styles.css'

function headerLogged(props){
    return <div>
            <header className="site__header">
                <a href="#" className="logo" onClick={props.onLogoClick}>Logo</a>
                <div className="header__actions">
                    <a href="#" className="create__link" onClick={props.onCreatePartyupClick}>Crear Partyup</a>
                    <a href="#" className="profile__link" onClick={props.onProfileClick}>Perfil</a>
                    <a href="#" className="logout__link" onClick={props.onLogoutClick}>Cerrar sesión</a>
                </div>
            </header>
    </div>

}

export default headerLogged