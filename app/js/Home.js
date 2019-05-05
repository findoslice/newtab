import React from 'react';

import Clock from'react-live-clock';

import SearchBar from './SearchBar.js';
import Weather from './Weather.js';
import BackgroundDescription from './BackgroundDescription.js';
import Footer from './Footer.js';
import Name from './Name.js';

export default class Home extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (<div id = "center">
        <div id = "clock">
            <Clock format={'HH:mm'} ticking={true} timezone={Intl.DateTimeFormat().resolvedOptions().timeZone} />
            <br />
            <div id = "date">
                <Clock format={'DD/MM/YY'} ticking={true} timezone={Intl.DateTimeFormat().resolvedOptions().timeZone} />
            </div>
            <Name />
            <div onClick = {this.props.todo}>
                view your todos
            </div>
        </div>
    </div>
        )
    }
}