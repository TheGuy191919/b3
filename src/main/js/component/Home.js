import React from 'react';
import {Link, Redirect} from 'react-router-dom';

import UserService from '../service/UserService';

import Navbar from './Navbar.js';
import Login from './Login';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.state.loggedIn = null;
        this.state.events = [];
        this.state.goToEvent = null;

        this.getEvents = this.getEvents.bind(this);
        this.selectEvent = this.selectEvent.bind(this);
    }

    componentDidMount() {
        this.getEvents();
    }

    getEvents() {
        UserService.getInstance().getEventForUser().then((events) => {
            if (events === null) {
                this.setState((prevState, props) => {
                    prevState.loggedIn = false;
                    return prevState;
                });
                return;
            }
            events.sort((first, second) => {
                return new Date(second.createTime.split('.')[0] + "Z") - new Date(first.createTime.split('.')[0] + "Z");
            });
            this.setState((prevState, props) => {
                prevState.events = events;
                prevState.loggedIn = true;
                return prevState;
            });
        });
    }

    selectEvent(event) {
        this.setState((prevState, props) => {
            prevState.goToEvent = event.eventId;
            return prevState;
        });
    }

    render() {
        if (this.state.goToEvent) {
          return <Redirect to={'/event/' + this.state.goToEvent} />;
        }
        if (this.state.loggedIn === null) {
            return null;
        }
        if (!this.state.loggedIn) {
            return (
            <div className="container">
                <Navbar eventListener={this.getEvents}
                        shouldRedir={false}/>
                <div className="text-center">
                    <h1>Welcome to Carve</h1>
                    <small className="">Please login</small>
                    <Login eventListener={this.getEvents} />
                </div>
            </div>);
        }
        return (
        <div className="container">
            <Navbar eventListener={this.getEvents}
                    shouldRedir={false}/>
            <ul className="list-group">
            {this.state.events.length === 0 &&
            <h1>No events yet, create some from above</h1>}
            {this.state.events.map((event) => {
                return (
                <li className="list-group-item"
                    key={event.eventId}>
                    <div className="row"
                         onClick={() => this.selectEvent(event)}>
                        <div className="col">
                            {event.name}
                        </div>
                        <div className="col-6 col-md-3 float-right">
                            <span className="float-right">
                                {new Date(event.createTime.split('.')[0] + "Z").toLocaleString(undefined, {month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", hour12:false})}
                            </span>
                        </div>
                    </div>
                </li>);
            })}
            </ul>
        </div>
        );
    }
}