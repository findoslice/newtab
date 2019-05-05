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
import SearchBar from './app/js/SearchBar.js'
import Name from './app/js/Name.js';
import Home from './app/js/Home.js';
import ToDos from './app/js/ToDos.js';
import Dashboard from './app/js/Dashboard.js';

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
        }).then(response => response.json()).then(json => {
                this.setState({name:json.name, preferred_name: json.preferred_name, email:json.email})
                fetch('https://api.newtab.findoslice.com/bg').then(response => response.json()
                ).then(json => {
                    console.log(json)
                    this.setState({bg: json})
                })
                this.setState({loggedin: true})
        }).catch(err => {
            this.setState({loggedin : false, bg : {
                image : "https://cdn.tulip.findoslice.com/geneva-clouds.jpg", 
                description: 'Clouds in the sky over Geneva, Switzerland.', 
                photographer : { 
                    url:'https://lianaahmed.com', 
                    name:'Liana Ahmed',
                }
            }
        })})
        this.registered = this.registered.bind(this);
        this.setLoginView = this.setLoginView.bind(this);
        this.logOut = this.logOut.bind(this)
        this.resetLoginPrompt = this.resetLoginPrompt.bind(this)
        this.todo = this.todo.bind(this)
    }

    // componentWillMount() {
    //     fetch("https://api.newtab.findoslice.com/name", {
    //         method: "GET",
    //         credentials: "include"
    //     }).then(response => response.json()).then((json) => {
    //         this.setState({name: json.name})
    //     })
    // }

    setLoginView(view) {
        this.setState({loginView: view})
    }

    resetLoginPrompt() {
        this.setState({loginView: undefined, loggedin: false})
    }

    logOut() {
        fetch("https://api.newtab.findoslice.com/logout", {
            method: "POST",
            credentials: "include"
        }).then(response => response.json()).then(
            this.setState({loggedin : false,loginView: undefined, bg : {
                    image : "https://cdn.tulip.findoslice.com/geneva-clouds.jpg", 
                    description: 'Clouds in the sky over Geneva, Switzerland.', 
                    photographer : { 
                        url:'https://lianaahmed.com', 
                        name:'Liana Ahmed',
                    }
                },
                name: '',
                email: ''
            })
        )
    }

    registered () {
        fetch("https://api.newtab.findoslice.com/isloggedin", {
            method : "GET",
            headers : {
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            credentials: "include"
        }).then(response => response.json()).then(json => {
                this.setState({name:json.name, email:json.email})
                fetch('https://api.newtab.findoslice.com/bg').then(response => response.json()
                ).then(json => {
                    console.log(json)
                    this.setState({bg: json})
                })
                this.setState({loggedin: true})
        }).catch(err => {
            this.setState({loggedin : false, bg : {
                image : "https://cdn.tulip.findoslice.com/geneva-clouds.jpg", 
                description: 'Clouds in the sky over Geneva, Switzerland.', 
                photographer : { 
                    url:'https://lianaahmed.com', 
                    name:'Liana Ahmed',
                }
            }
        })})
    }

    todo() {
        this.setState({todo: true})
    }

    render() {
        console.log(this.state)
        if (this.state.bg != undefined) {
            if (this.state.loggedin) {
                return (
                    <div id="container" style={{backgroundImage : `url(${this.state.bg.image})`}}>
                    <SearchBar />
                    <Weather />
                    {this.state.todo?<Dashboard />:<Home todo = {this.todo} />}
                    {this.state.todo?null:<BackgroundDescription bg = {this.state.bg} />}
                    <Footer logOut = {this.logOut}/>
                        {/* {this.state.todo?<ToDos />:<Home logOut = {this.logOut} bg = {this.state.bg} todo = {this.todo}/>} */}
                    </div>
                )
            } else {
                if (this.state.loginView === "register") {
                    return (
                        <div id="container" style={{backgroundImage : `url(${this.state.bg.image})`}}>
                            <Register registered = {this.registered} resetLoginPrompt = {this.resetLoginPrompt} bg = {this.state.bg}/>
                        </div>
                    )
                } else if (this.state.loginView === "login") {
                    return <div id="container" style={{backgroundImage : `url(${this.state.bg.image})`}}>
                                <Login loggedIn = {this.registered} resetLoginPrompt = {this.resetLoginPrompt} bg = {this.state.bg}/>
                           </div>
                } else {
                    return (<div id="container" style={{backgroundImage : `url(${this.state.bg.image})`}}>
                        <LoginPrompt setLoginView = {this.setLoginView}/>
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
