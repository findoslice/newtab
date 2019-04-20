import React from 'react';
import ReactDOM from 'react-dom';

import Clock from'react-live-clock';

import Weather from './app/js/Weather.js';
import BackgroundDescription from './app/js/BackgroundDescription.js';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {bg:undefined}
    }

    componentWillMount() {
      fetch("https://api.newtab.findoslice.com/bg").then(response => response.json()
      ).then(json => {
        console.log(json)
        this.setState({bg: json})
      })
    }

    render() {
        console.log(this.state.bg)
        if (this.state.bg) {
            return (
                <div id="container" style={{backgroundImage : `url(${this.state.bg.image})`}}>
                    <Weather />
                    <div id = "center">
                        <div id = "clock">
                            <Clock format={'HH:mm'} ticking={true} timezone={Intl.DateTimeFormat().resolvedOptions().timeZone} />
                        </div>
                    </div>
                    <BackgroundDescription bg = {this.state.bg} />
                </div>
            )
        } else {
            return <div></div>
        }
    }
}
let root = document.getElementById('root');
ReactDOM.render(<App />,
                root);
