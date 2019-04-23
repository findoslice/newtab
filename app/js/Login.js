import React from 'react';

import PasswordHash from 'password-hash';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {err : undefined}
        this.logIn = this.logIn.bind(this)
    }

    logIn(event) {
        event.preventDefault();
        console.log(event.target.elements)
        fetch("https://api.tulip.findoslice.com/login", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                                  email: event.target.elements.email.value,
                                  password: event.target.elements.password.value
                                 })
                                }).then(response => response.json()).catch(err => {
                                    console.log("skrrt")
                                    this.setState({err: "Invalid login details"})
                                    return
                                }).then((json) => {
                                    console.log(json)
                                    //Cookies.set('token', json.token, {expires: 100000000000})
                                    this.props.loggedIn()
                                })
    }

    render() {
        return (
            <div id = "form">
                {this.state.err?<p id="error">{this.state.err}</p>:null}
                <form onSubmit={this.logIn}>
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
                    <input type="submit" value="Log in!" className="button"/>
                </form>
            </div>
        )
    }
}