import React from 'react';

export default class BackgroundDescription extends React.Component{
    constructor(props) {
        super(props);
        console.log(this.props)
    }

    render() {
        return (
            <div id="bgdescription">
                <h4>
                    {this.props.bg.description}
                </h4>
                <p>
                    Photo by <a href={this.props.bg.photographer.url} target="_blank">{this.props.bg.photographer.name}</a>
                </p>
            </div>
        )
    }

}