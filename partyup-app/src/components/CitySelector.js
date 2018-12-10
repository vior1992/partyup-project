import React from 'react'
import '../components/Home/styles.css'

function CitySelector(props) {
    return <select className="" name="city" id="" onChange={props.onHandleCityChange}>
        <option disabled selected>Elige una ciudad</option>
        <option value="Barcelona">Barcelona</option>
        <option value="Madrid">Madrid</option>
        <option value="Bilbao">Bilbao</option>
        <option value="Valencia">Valencia</option>
        <option value="Sevilla">Sevilla</option>
    </select>
}

export default CitySelector
