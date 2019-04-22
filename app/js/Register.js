import React from 'react';
import Cookies from 'js-cookie';

import PasswordHash from 'password-hash'

export default class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {err: undefined}
        this.register = this.register.bind(this);
    }

    register(event) {
        event.preventDefault();
        console.log(event.target.elements)
        if (event.target.elements.password.value === event.target.elements["password-repeat"].value){
        fetch("https://api.newtab.findoslice.com/register", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            credentials: "include",
            body: JSON.stringify({name: event.target.elements.name.value,
                                  email: event.target.elements.email.value,
                                  password: event.target.elements.password.value
                                 })
                                }).then(response => response.json()).catch(err => {
                                    console.log("skrrt")
                                    this.setState({err: "Unsuccessful registration, this email has probably already been taken"})
                                    return
                                }).then((json) => {
                                    console.log(json)
                                    Cookies.set('token', json.token, {expires: 100000000000})
                                    this.props.registered()
                                })
        } else {
            this.setState({err: "Passwords do not match"})
        }
    }


    render () {
        return (
            <div id = "form">
                {this.state.err?<p id="error">{this.state.err}</p>:null}
                <form onSubmit={this.register}>
                    <label className = "textinput">
                        Name:
                        <br />
                        <input type="text" name = "name"/>
                    </label>
                    <label className = "textinput">
                        email:
                        <br />
                        <input type="text" name = "email"/>
                    </label>
                    <label className = "textinput">
                        Password:
                        <br />
                        <input type="password" name = "password"/>
                    </label>
                    <label className = "textinput">
                        Repeat Password:
                        <br />
                        <input type="password" name = "password-repeat"/>
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        )
    }
}