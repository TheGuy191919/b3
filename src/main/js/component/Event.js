import React from 'react';
import {Link} from 'react-router-dom';

import EventService from '../service/EventService';

import Navbar from './Navbar.js';
import MemberList from './MemberList.js';
import ItemList from './ItemList.js';
import PayerList from './PayerList.js';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.state.event = null;
        this.state.error = null;
        this.state.status = "saved";

        this.timeoutId = null;

        this.getEvent = this.getEvent.bind(this);
        this.putEvent = this.putEvent.bind(this);
        //this.updateEvent = this.updateEvent.bind(this);
    }

    componentDidMount() {
        this.getEvent(this.props.match.params['eventId']);
    }
/*
    componentDidUpdate(prevProps, prevState) {
        this.updateEvent();
    }

    componentWillUnmount() {
        this.putEvent();
    }
*/
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
/*
    updateEvent() {
        if (this.state.status === "saved") {
            return;
        }

        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId);
        }
        this.timeoutId = window.setTimeout(this.putEvent, 200);
    }
*/
    putEvent() {
        EventService.getInstance().putEvent(this.state.event).then((event) => {
            this.setState((prevState, props) => {
                prevState.event = event;
                prevState.status = "saved";
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
            <div>
                <ul className="list-group">
                    <li className="list-group-item">
                        {this.state.event.name}(
                        <button className="btn btn-link">
                            {this.state.status}
                        </button>)
                    </li>
                </ul>
            </div>
            <div id="accordion">
              <div className="card">
                <div className="card-header bg-transparent" id="headingOne">
                  <h5 className="mb-0">
                    <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      Members
                    </button>
                  </h5>
                </div>
                <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                  <div className="card-body">
                    <MemberList parent={this} memberList={this.state.event.users}/>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header bg-transparent" id="headingTwo">
                  <h5 className="mb-0">
                    <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      Items
                    </button>
                  </h5>
                </div>
                <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                  <div className="card-body">
                    <ItemList parent={this} />
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header bg-transparent" id="headingThree">
                  <h5 className="mb-0">
                    <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      Payers
                    </button>
                  </h5>
                </div>
                <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                  <div className="card-body">
                    <PayerList parent={this} />
                  </div>
                </div>
              </div>
            </div>
            {JSON.stringify(this.state.event)}
        </div>
        );
    }
}