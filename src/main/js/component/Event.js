import React from 'react';
import {Link} from 'react-router-dom';

import EventService from '../service/EventService';

import Navbar from './Navbar.js';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.state.event = null;
        this.state.error = null;

        this.getEvent = this.getEvent.bind(this);
    }

    componentDidMount() {
        this.getEvent(this.props.match.params['eventId']);
    }

    getEvent(eventId) {
        EventService.getInstance().getEvent(eventId)
        .then(event => {
            if (event === null) {
                return;
            }
            this.setState((prevState, props) => {
                prevState.event = event;
                return prevState;
            });
        });
    }

    render() {
        if (this.state.error) {
            return (
            <div className="container">
               <Navbar />
               <h1>Error, please return to home page</h1>
               <h3>{this.state.error}</h3>
            </div>);
        }
        if (this.state.event === null) {
            return (
            <div className="container">
                <Navbar />
            </div>);
        }
        return (
        <div className="container">
            <Navbar />
            {this.state.event.eventId}
        </div>
        );
    }
}