import React from 'react';

export default class Name extends React.Component {

    constructor(props){
        super(props);
        this.state = {style:{width:"5px"}};
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        fetch("https://api.newtab.findoslice.com/name", {
            method : "GET",
            credentials: "include"
        }).then(response => response.json()).then(json => {
            this.setState({preferredName: json.preferred_name, style: {
                width: ((json.preferred_name.length + 1) * 16).toString() + "px"
            }})
        })
    }

    handleChange(event) {
        this.setState({preferredName: event.target.value, style:{
                    width: ((event.target.value.length) * 16+4).toString() + "px"
                }
            }
        )
        fetch("https://api.newtab.findoslice.com/updatename", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                preferred_name: event.target.value
            })
        })
    }

    render() {
        console.log(this.state.style)
        return (
            <div id="name">
                <h1> Hello, <input type="text" value={this.state.preferredName} onChange={this.handleChange} style = {this.state.style}/>!
                <span className="fas fa-pencil-alt"></span>
                </h1>
            </div>
        )
    }
}