import React from 'react';

export default class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="footer">
                <p>
                    This page was developed by <a href="https://findoslice.com" target="_blank">Findlay Smith</a>, while he was procrastinating his exam revision. <a href="https://github.com/findoslice/newtab" target="_blank"><span className = "fab fa-github" ></span></a>
                </p>
                <h4 onClick={this.props.logOut}>
                    log out                
                </h4>
            </div>
        )
    }
}