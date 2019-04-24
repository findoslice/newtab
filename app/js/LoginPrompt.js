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
                <img src="https://cdn.tulip.findoslice.com/tulip-banner.png" />
                    <h4>
                        Tulip is a chrome extension, providing a sleek, visually appealing dashboard every time you open a new tab.
                        Tulip is built around three core principles: that we should provide a minimalist, well built UI; that Tulip should be free in its entirety
                        to everybody; and that Tulip's source code should remain open source and publicly available forever.
                        These are our promises to you:
                    </h4>
                    <ul>
                        <li className = "fas">
                            <div>
                                Tulip will remain without a requirement for payment, forever, for everyone. What does this mean in practice? We will never put any of
                                our content behind a pay wall, we'll never have premium features, and we'll never charge you just to use the application.
                            </div>
                        </li>
                        <li className = "fas">
                            <div>
                                We will never sell user data to a third party, we'll never data mine our users or collect any data past that which is strictly
                                necessary for Tulip's functionality.
                            </div>
                        </li>
                        <li className = "fas">
                            <div>
                                We will never have adverts on Tulip. The vision of Tulip was for a sleek, free browser dashboard with a visually appealing minimalist 
                                design, and adverts don't fit anywhere in that design philosophy.
                            </div>
                        </li>
                        <li className = "fas">
                            <div>
                                Tulip's <a href="https://github.com/findoslice/tulip" target="_blank">source code</a> will remain publicly available and open source, in order to maintain
                                complete transparency we will never hide our source code from our users.
                            </div>
                        </li>
                    </ul>
                <button type="button" onClick = {this.setLogin} className="button">
                    Log in
                </button>
                <button type="button" onClick = {this.setRegister} className="button">
                    Register
                </button>
                </div>
            </div>
        )
    }
}