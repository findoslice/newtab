import React from 'react';

export default class Weather extends React.Component {
    constructor(props) {
        super(props);
        this.state = {lat: undefined, lon: undefined};
        this.setPosition = this.setPosition.bind(this);
        this.getIcon = this.getIcon.bind(this);
        this.getThermometer = this.getThermometer.bind(this);
        this.tick = this.tick.bind(this);
    }

    tick() {
        navigator.geolocation.getCurrentPosition(this.setPosition);
    }

    setPosition(position) {
        fetch(`https://api.newtab.findoslice.com/weather`, {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
             },
             method: "POST",
             body: JSON.stringify({lat:position.coords.latitude, lon:position.coords.longitude})
        }).then(response => {return response.json()}).then(
            json => {
                console.log(json)
                this.setState({lat:position.coords.latitude, lon:position.coords.longitude, weather : json})
            });
    }

    getThermometer(){
        let temp = this.state.weather.current_observation.condition.temperature;

        if (temp < 0) {
            return "fas fa-thermometer-low"
        } else if (temp < 10) {
            return "fas fa-thermometer-quarter"
        } else if (temp < 20 ) {
            return "fas fa-thermometer-half"
        } else if (temp < 30) {
            return "fas fa-thermometer-three-quarters"
        } else {
            return "fas fa-thermometer-high"
        }
    }

    getIcon() {
        console.log(this.state.weather.current_observation.condition.code)
        switch (this.state.weather.current_observation.condition.code){
            //thunderstorms
            case 3:
            case 4:
                return "fas fa-bolt";
            case 6:
            case 18:
            case 35:
                return "fas fa-showers-heavy";
            // showers or drizzle
            case 8:
            case 9:
            case 11:
            case 12:
            case 40:
                return "fas fa-cloud-rain";
            //snow
            case 7:
            case 13:
            case 14:
            case 16:
                return "fas fa-snowflake";
            //windy, blowing
            case 15:
            case 23:
            case 24:
                return "fas fa-wind"
            //cloudy, misty, hazy
            case 26:
            case 20:
            case 21:
            return "fas fa-cloud";
            //mostly|partly cloudy, night
            case 27:
            case 29:
                return "fas fa-cloud-moon";
            //mostly|partly cloudy, day
            case 28:
            case 30:
            case 44:
                return "fas fa-cloud-sun";
            //clear, night
            case 31:
            case 33:
                return "fas fa-moon";
            // sunny
            case 32:
            case 34:
                return "fas fa-sun";
            default:
                return "fas fa-sun";
        }
    }
    
    componentDidMount() {
        if (!(this.state.lat && this.state.lon)){
            navigator.geolocation.getCurrentPosition(this.setPosition);
        }
        this.interval = setInterval(() => this.tick(), 600000);
    }
    render(){
        console.log(this.state.weather)
        if (this.state.weather){
            return (
                <div id = "weather">
                    <p> {this.state.weather.location.city}, {this.state.weather.location.region}</p>
                    <h1>
                        <span className={this.getThermometer()}></span>
                        {this.state.weather.current_observation.condition.temperature}&deg;C
                    </h1>
                    <h1>
                        {this.state.weather.current_observation.condition.text}
                    </h1>
                    <h1 className={this.getIcon()}></h1>
                </div>
            )
        } else {
            return (
                <div></div>
            )
        }
    }
}