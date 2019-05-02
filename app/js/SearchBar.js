import React from 'react';
import {BrowserRouter, Switch, Redirect} from 'react-router-dom';

export default class SearchBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {searchUrl:undefined}
        this.search = this.search.bind(this);
    }

    search(event) {
        event.preventDefault()
        let searchEndpoint = "https://ecosia.org/search?q=" + encodeURIComponent(event.target.elements.search.value).replace(/%20/g, "+")
        window.location.href = (searchEndpoint)
    }

    render() {
        return (
            <div id="searchbar">
                <form onSubmit={this.search} autocomplete="off">
                    <label className = "textinput">
                        <span class = "fas fa-search"></span>
                        <input type="text" name = "search"/>
                    </label>
                </form>
            </div>
        )
    }
}