import React from 'react'

export default class LoginPrompt extends React.Component {
    constructor(props) {
        super(props)
        this.setRegister = this.setRegister.bind(this)
        this.setLogin = this.setLogin.bind(this)
    }

    setRegister (event) {
        this.props.setLoginView("register")
    }

    setLogin (event) {
        this.props.setLoginView("login")
    }

    render() {
        return (
            <div id="loginprompt">
                <div id = "text">
                    <h1>
                        NewTab
                    </h1>
                    <h4>
                        NewTab is a chrome extension, providing a sleek, visually appearing dashboard every time you open a new tab.
                        NewTab is built around three core principles: that we should provide a minimalist, well built UI; that NewTab should be free in its entirety
                        to everybody; and that NewTab's source code should remain open source and publicly available forever.
                        These are our promises to you:
                    </h4>
                    <ul>
                        <li className = "fas">
                            <div>
                                NewTab will remain without a requirement for payment, forever, for everyone. What does this mean in practice? We will never put any of
                                our content behind a pay wall, we'll never have premium features, and we'll never charge you just to use the application.
                            </div>
                        </li>
                        <li className = "fas">
                            <div>
                                We will never sell user data to a third party, we'll never data mine our users or collect any data past that which is strictly
                                necessary for NewTab's functionality.
                            </div>
                        </li>
                        <li className = "fas">
                            <div>
                                We will never have adverts on NewTab. The vision of NewTab was for a sleek, free browser dashboard with a visually appealing minimalist 
                                design, and adverts don't fit anywhere in that design philosophy.
                            </div>
                        </li>
                        <li className = "fas">
                            <div>
                                NewTab's <a href="https://github.com/findoslice/newtab">source code</a> will remain publicly available and open source, in order to maintain
                                completely transparent we will never hide our source code from our users.
                            </div>
                        </li>
                    </ul>
                </div>
                <button type="button" onClick = {this.setLogin}>
                    Log in
                </button>
                <button type="button" onClick = {this.setRegister}>
                    Register
                </button>
            </div>
        )
    }
}