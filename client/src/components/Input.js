import React, { useState, useEffect } from 'react';
import axios from 'axios';

const send_req = async (query, setJourney) => {
    await axios.get(`http://localhost:8000/?${query}`)
        .then((res) => {
            setJourney(res.data.content[0]);

            const loadingIco = document.querySelector("#loading");
            loadingIco.style.display = 'none';

        }).catch((err) => {
            prompt('Error Occurred');
        });
}

const JourneyView = ({ journey }) => {
    if (journey.journey === undefined) {
        return <div></div>
    }
    else {
        journey = journey.journey.split('Day');

        return <ul id='journey'>{
            journey.map((daywise, index) => {
                if(daywise) {
                    if(daywise.includes('sustain')) {
                        return <ul key={index} className='daywise-journey green'> <h3 className='sus-tips'>Includes Sustainable Tips</h3> {"Day " + daywise} </ul>
                    }
                    else{
                        return <ul key={index} className='daywise-journey'> {"Day " + daywise} </ul>
                    }
                }
            })
        }</ul>
    }
}

const Input = () => {
    const [ journey, setJourney ] = useState([]);

    return <React.Fragment>
        <div id='search-bar'>
            <input type="text" placeholder='Enter Your City' name="start" id="start-location" />
            <input type="text" placeholder='Enter Your Destination' name="end" id="end-location" />
            <input type="number" placeholder='Days' min={1} max={10} name="days" id="days" />
        </div>
        <button id='calc' onClick={() => {
            const s = document.querySelector('#start-location').value;
            const e = document.querySelector('#end-location').value;
            const d = document.querySelector('#days').value;

            if (s && e && d) { 
                send_req(`s=${s.trim()}&e=${e.trim()}&d=${d.trim()}`.toLowerCase(), setJourney);

                const loadingIco = document.querySelector("#loading");
                loadingIco.style.display = 'flex';
            }
            else { 
                alert('Please fill all the fields!'); 
            }
        }}>Generate</button>

        <JourneyView journey={journey} />

    </React.Fragment>
}

export default Input;
