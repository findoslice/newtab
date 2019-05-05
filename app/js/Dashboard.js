import React from 'react';

import ToDos from './ToDos.js';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {unclassified: [], list_headings:[]}
        this.addToDo = this.addToDo.bind(this)
        this.deleteToDo = this.deleteToDo.bind(this)
    }

    componentWillMount() {
        if (!this.props.unclassified) {
            fetch("https://api.newtab.findoslice.com/todos/all", {
                method: "GET",
                credentials: "include"
            }).then(response => response.json()).then(json => {
                this.setState(json)
            })
        } else {
            this.setState({unclassified:this.props.unclassified, list_headings:[]})
        }
    }

    addToDo (event) {
        event.preventDefault()
        console.log(event.target.elements.list_heading.checked)
        fetch("https://api.newtab.findoslice.com/todos/new", {
            method: 'POST',
            credentials: 'include',
            headers : {
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            body: JSON.stringify({
                content: event.target.elements.content.value,
                sublist: event.target.elements.sublist.value || null,
                list_heading: event.target.elements.list_heading.checked
            })
        }).then(response => response.json()).then(json => {
            fetch("https://api.newtab.findoslice.com/todos/all", {
                method: "GET",
                credentials: "include"
            }).then(response => response.json()).then(json => {
                this.setState(json)
            })
        })
    }

    deleteToDo (id) {
        fetch("https://api.newtab.findoslice.com/todos/delete", {
            method: "DELETE",
            credentials: 'include',
            headers : {
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            body: JSON.stringify({
                id: id
            })
        }).then(response => {
            fetch("https://api.newtab.findoslice.com/todos/all", {
                method: "GET",
                credentials: "include"
            }).then(response => response.json()).then(json => {
                this.setState(json)
            })
        })
    } 

    render() {
        console.log(this.state)
        return (
            <div id="todos">
                <form onSubmit = {this.addToDo}>
                    <input type="text" name="content" className="button"/>
                    <select name="sublist" className="button">
                        <option value = "">none</option>
                        {this.state.unclassified.filter(el => el.list_heading).map((el, index) => {
                            return <option value = {el.id}>{el.content}</option>
                        })}
                    </select>
                    <input type = "checkbox" name = "list_heading" />
                    <input type="submit" className = "button" value = "Add todo"/>
                </form>
                <ToDos unclassified = {this.state.unclassified} list_headings = {this.state.list_headings} topLevel = {true} delete = {this.deleteToDo}/>
            </div>
        )
    }
}