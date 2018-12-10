import React from 'react'
import "./styles.css"
import logic from '../../logic';

function ItemListPartyups(props) {
    return <div onClick={() => !logic.loggedIn ? props.onPartyupClickNotLogged() : props.onPartyupClick(props.id, props.actuallUserId) } className="partyups__event" a>
        {props.picture ? <img className="partyups__picture" src={props.picture}></img> : <img className="partyups__picture" src="https://cps-static.rovicorp.com/3/JPG_500/MI0003/752/MI0003752888.jpg?partner=allrovi.com"></img>}
        <div className="partyups__info">
            <p className="info__date">{props.date.slice(0,10)}</p>
            <h4 className="info__title">{props.title}</h4>
            <p className="info__description">{props.place}</p>
            <p className="info__host">Asistentes: {props.assistants.length}</p>
        </div>
    </div>
}

export default ItemListPartyups