import React from 'react';
import ReactDOM from 'react-dom';

import Clock from'react-live-clock';

import Cookies from 'js-cookie';

import Footer from './app/js/Footer.js';
import Weather from './app/js/Weather.js';
import BackgroundDescription from './app/js/BackgroundDescription.js';
import Register from './app/js/Register.js';
import Login from './app/js/Login.js';
import LoginPrompt from './app/js/LoginPrompt.js';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {bg:undefined, loginView: undefined}
        fetch("https://api.newtab.findoslice.com/isloggedin", {
            method : "GET",
            headers : {
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            credentials: "include"
        }).then((response) => {
            console.log(response)
            if (response.status != 200) {
                this.setState({loggedin : false/*, bg : {
                    image : "https://lh3.google.com/u/0/d/1QRJqtFWZFZWXQqmqziny-Wq8QeGQvqD_=w1365-h1063-iv1", 
                    description: 'Clouds in the sky over Geneva, Switzerland.', 
                    photographer : { 
                        url:'https://lianaahmed.com', 
                        name:'Liana Ahmed',
                    }
                }*/
            })
            } else {
                this.setState({loggedin: true})
            }
        })
        this.registered = this.registered.bind(this);
        this.setLoginView = this.setLoginView.bind(this);
        this.logOut = this.logOut.bind(this)
    }

    componentWillMount() {
      fetch('https://api.newtab.findoslice.com/bg').then(response => response.json()
      ).then(json => {
        console.log(json)
        this.setState({bg: json})
      })
    }

    setLoginView(view) {
        this.setState({loginView: view})
    }

    logOut() {
        fetch("https://api.newtab.findoslice.com/logout", {
            method: "POST",
            credentials: "include"
        }).then(response => response.json()).then(
        this.setState({loggedin: false, loginView: undefined}))
    }

    registered () {
        fetch('https://api.newtab.findoslice.com/bg').then(response => response.json()
        ).then(json => {
            console.log(json)
            this.setState({bg: json, loggedin: true})
        })
    }

    render() {
        console.log(this.state)
        if (this.state.bg != undefined) {
            if (this.state.loggedin) {
                return (
                    <div id="container" style={{backgroundImage : `url(${this.state.bg.image})`}}>
                        <Weather />
                        <div id = "center">
                            <div id = "clock">
                                <Clock format={'HH:mm'} ticking={true} timezone={Intl.DateTimeFormat().resolvedOptions().timeZone} />
                                <br />
                                <div id = "date">
                                    <Clock format={'DD/MM/YY'} ticking={true} timezone={Intl.DateTimeFormat().resolvedOptions().timeZone} />
                                </div>
                            </div>
                        </div>
                        <BackgroundDescription bg = {this.state.bg} />
                        <Footer logOut = {this.logOut}/>
                    </div>
                )
            } else {
                if (this.state.loginView === "register") {
                    return (
                        <div id="container" style={{backgroundImage : `url(${this.state.bg.image})`}}>
                            <Register registered = {this.registered}/>
                        </div>
                    )
                } else if (this.state.loginView === "login") {
                    return <div id="container" style={{backgroundImage : `url(${this.state.bg.image})`}}>
                                <Login loggedIn = {this.registered} />
                           </div>
                } else {
                    return (<div id="container" style={{backgroundImage : `url(${this.state.bg.image})`}}>
                        <LoginPrompt setLoginView = {this.setLoginView} />
                    </div>)
                }
            }
        }
        return <div></div>
        
    }
}
let root = document.getElementById('root');
ReactDOM.render(<App />,
                root);
