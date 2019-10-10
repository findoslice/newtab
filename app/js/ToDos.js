import React from 'react';

import ToDo from './ToDo.js';

export class ToDoList extends React.Component {

    constructor(props) {
        super(props)

    }
}

export default class ToDos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.deleteToDo = this.deleteToDo.bind(this)
        if (this.props.sublist) {
            this.state.unclassified = this.props.unclassified
            this.state.list_headings = this.props.unclassified.filter(el => {
                return el.list_heading && el.sublist == this.props.sublist})
        } else {
            this.state.unclassified = this.props.unclassified
            this.state.list_headings = this.props.unclassified.filter(el => {
                return el.list_heading})
        }
    }

    deleteToDo (id) {
        this.props.delete(id)
        // if (this.state.unclassified.length == 1 && this.state.list_headings.length == 0) {
        //     this.state.unclassified = []
        // } else if (this.state.unclassified.length == 0 && this.state.list_headings == 1) {
        //     this.state.list_headings = []
        // } 
        // else {
        //     this.state.unclassified = this.state.unclassified.filter(el => !(el.id == id || el.sublist == id))
        //     this.state.list_headings = this.state.list_headings.filter(el => !(el.id == id || el.sublist == id))
        // }
        //this.setState({unclassified: this.state.unclassified.filter(el => !(el.id == id || el.sublist == id)), list_headings: this.state.list_headings.filter(el => !(el.id == id || el.sublist == id))})
    }


    
    render() {
        if (this.props.sublist) {
            this.state.unclassified = this.props.unclassified.filter(el => el.sublist === this.props.sublist)
            this.state.list_headings = this.props.unclassified.filter(el => {
                return el.list_heading && el.sublist == this.props.sublist})
        } else {
            this.state.unclassified = this.props.unclassified
            this.state.list_headings = this.props.unclassified.filter(el => {
                return el.list_heading && !el.sublist})
        }
        console.log(this.state)
        if (!this.props.topLevel) {
            return (
                <div>
                    <ul>
                        {this.state.unclassified.map((el, index) => {
                            if ((el.sublist === null || el.sublist === this.props.sublist) && !el.list_heading) {
                                return (
                                    <ToDo {...el} delete = {this.deleteToDo}/>
                                    )
                                } else {
                                    return null
                                }
                            })}
                        {this.state.list_headings.map((el, index) => {
                            return (
                                <li key={index*4}>
                                    <ToDo title = {el.content} {...el} delete = {this.props.delete}/>
                                    <ToDos sublist = {el.id} 
                                        unclassified = {this.props.unclassified}
                                        topLevel = {false}
                                        delete = {this.deleteToDo}/>
                                </li>
                        )})}
                    </ul>
                </div>
            ) 
        } else {
            return (
                <div id = "todos-container">
                    <div className = "kanban">
                        <h4>Unclassified ToDos</h4>
                        <ul>
                            {this.state.unclassified.sort((a,b) => (a>b)?1:-1).map((el, index) => {
                                if ((el.sublist === null || el.sublist === this.props.sublist) && !el.list_heading) {
                                    return (
                                        <ToDo {...el} 
                                        delete = {this.props.delete}/>
                                        )
                                    } else {
                                        return null
                                    }
                                })}
                        </ul>
                    </div>
                        {this.state.list_headings.sort((a,b) => (a>b)?1:-1).map((el, index) => {
                            return (
                                <div className="kanban">
                                    <ToDo title = {el.content} {...el}
                                          delete = {this.props.delete}/>
                                    <ToDos sublist = {el.id} 
                                        unclassified = {this.props.unclassified}
                                        isChild = {!!this.props.sublist}
                                        delete = {this.props.delete}/>
                                </div>
                        )})}
                </div>
            )
        }
    }
}