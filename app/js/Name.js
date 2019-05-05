import React from 'react';

export default class Name extends React.Component {

    constructor(props){
        super(props);
        this.state = {style:{width:"5px"}};
        this.submitName = this.submitName.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onUnload = this.onUnload.bind(this);
    }

    onUnload(event) {
        event.preventDefault()
        event.retrunValue = ''
        fetch("https://api.newtab.findoslice.com/updatename", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                preferred_name: this.state.preferredName
            })
        })
    }

    componentWillMount() {
        window.addEventListener('beforeunload', this.onUnload);
        fetch("https://api.newtab.findoslice.com/name", {
            method : "GET",
            credentials: "include"
        }).then(response => response.json()).then(json => {
            this.setState({preferredName: json.preferred_name, style: {
                width: ((json.preferred_name.length) * 16 + 12).toString() + "px"
            }})
        })
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onUnload);
    }

    submitName(event) {
        this.setState({preferredName: event.target.value, style:{
                    width: ((event.target.value.length) * 16+12).toString() + "px"
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

    onChange(event) {
        this.setState({preferredName: event.target.value, style:{
            width: ((event.target.value.length) * 16+12).toString() + "px"
        }
    }
)
    }

    render() {
        console.log(this.state.style)
        return (
            <div id="name">
                <h1> Hello, <input type="text" value={this.state.preferredName} onBlur={this.submitName} onChange = {this.onChange} style = {this.state.style}/>!
                <span className="fas"></span>
                </h1>
            </div>
        )
    }
}