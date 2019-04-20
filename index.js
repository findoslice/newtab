import React from 'react';
import ReactDOM from 'react-dom';

import Weather from './app/js/Weather.js';

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Weather />
        )
    }
}
let root = document.getElementById('root');
ReactDOM.render(<App />,
                root);
