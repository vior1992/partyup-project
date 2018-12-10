import React from 'react'
import '../components/Home/styles.css'


function TagSelector(props) {
    return <select className="tags__selector" name="tags" id="" onChange={props.onHandleTagsChange}>
        <option disabled selected>Elige un tag</option>
        <option value="pop">Pop</option>
        <option value="jazz">Jazz</option>
        <option value="rock">Rock</option>
        <option value="heavy">Heavy</option>
        <option value="indie">Indie</option>
        <option value="reggae">Reggae</option>
        <option value="reggaeton">Reggaeton</option>
        <option value="blues">Blues</option>
        <option value="soul">Soul</option>
        <option value="electronica">Electronica</option>
        <option value="clasica">Clasica</option>
        <option value="desfase">Desfase</option>
        <option value="tranquis">De tranquis</option>
        <option value="otros">Otros</option>
        <option value="varios">Varios</option>
    </select>
}

export default TagSelector

