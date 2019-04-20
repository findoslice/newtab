import React from 'react';
import ReactDOM from 'react-dom';

import Clock from'react-live-clock';

import Weather from './app/js/Weather.js';

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
        return (
            <span>
                <Weather />
                <div id = "clock">
                    <Clock format={'HH:mm'} ticking={true} timezone={Intl.DateTimeFormat().resolvedOptions().timeZone} />
                </div>
            </span>
        )
    }
}
let root = document.getElementById('root');
ReactDOM.render(<App />,
                root);
