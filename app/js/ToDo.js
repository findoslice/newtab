import React from 'react';

export default class ToDo extends React.Component {

    constructor(props) {
        super(props)
        this.state = {...props, style: {
            width: (this.props.content.length*16+12).toString() + "px",
        }}
        this.onChange = this.onChange.bind(this);
        this.updateToDo = this.updateToDo.bind(this);
        this.deleteToDo = this.deleteToDo.bind(this);
        this.toggle = this.toggle.bind(this)
    }

    componentWillMount() {
        window.addEventListener('beforeunload', this.updateToDo)
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.updateToDo)
    }

    updateToDo() {
        fetch("https://api.newtab.findoslice.com/todos/update", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                content: this.state.content,
                id: this.state.id
            })
        })
    }

    deleteToDo() {
        this.props.delete(this.props.id)
    }

    toggle () {
        fetch("https://api.newtab.findoslice.com/todos/complete", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                id: this.state.id,
                status: !this.state.completed
            })
        }).then(this.setState({completed: !this.state.completed}))
    }

    onChange(event) {
        console.log(event.target.innerText)
        this.setState({content: event.target.innerText, style: {
            width: (event.target.innerText.length*16+12).toString() + "px"
        }})
    }

    shouldComponentUpdate() {
        return false
    }

    render() {
        if (this.props.title) {
            return (
                <h4
                    contentEditable="true" onInput={this.onChange} 
                    onBlur = {this.updateToDo}
                    >
                        {this.props.title}
                            <span onClick = {this.deleteToDo} className = "fas fa-trash-alt" style= {this.state.trashStyle}></span>
                </h4>
            )
        } else {
            return (
                <li key={this.state.id}
                    contentEditable="true" onInput={this.onChange} 
                    onBlur = {this.updateToDo}>
                        {this.state.content}
                        <span onClick = {this.deleteToDo} className = "fas fa-trash-alt" style= {this.state.trashStyle}></span>
                </li>
            )
        }
    }
}