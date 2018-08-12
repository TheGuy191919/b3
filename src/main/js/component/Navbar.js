import React from 'react';
import {Link, Redirect} from 'react-router-dom';

import UserService from '../service/UserService';
import EventService from '../service/EventService';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.state.user = null;
        this.state.shouldRedir = props.shouldRedir;
        if (this.state.shouldRedir === undefined || this.state.shouldRedir === null) {
            this.state.shouldRedir = true;
        }
        this.state.redir = null;

        this.getUser = this.getUser.bind(this);
        this.createEvent = this.createEvent.bind(this);
        this.detectEnter = this.detectEnter.bind(this);
    }

    componentDidUpdate() {
        if (this.state.user === null) {
            this.getUser();
        }
    }

    componentDidMount() {
        this.getUser();
    }

    createEvent() {
        EventService.getInstance().createEvent({
            name: this.eventFld.value,
            tax: 0,
            tip: 0
        }).then((event) => {
            if (this.props.eventListener !== undefined &&
                this.props.eventListener !== null) {
                this.props.eventListener(event);
                if (this.state.shouldRedir) {
                    this.setState((prevState, props) => {
                        prevState.redir = "/";
                        return prevState;
                    });
                }
            }
        });
    }

    detectEnter(e) {
        if (e.keyCode === 13) {
          this.createEvent();
        }
    }

    getUser() {
        return UserService.getInstance().currentUser()
        .then((user) => {
            if ((this.state.user === null && user === null) ||
                (this.state.user !== null && user !== null)) {
                return;
            }
            this.setState((prevState, props) => {
                prevState.user = user;
                return prevState;
            })
        });
    }

    render() {
        if (this.state.redir) {
            return <Redirect to={this.state.redir}/>;
        }
        if (this.state.user) {
            return (
            <nav className="navbar navbar-expand-lg navbar-light
                            bg-light rounded mb-4">
                <div className="container">
                    <Link className="navbar-brand" to="/">Carve</Link>
                    <button className="navbar-toggler"
                          type="button"
                          data-toggle="collapse"
                          data-target="#courseManagerNavFields"
                          aria-controls="courseManagerNavFields"
                          aria-expanded="false"
                          aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="courseManagerNavFields">
                        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                            <li className="nav-item">
                                <Link to="/summary" className="nav-link">Summary</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/profile" className="nav-link">Profile</Link>
                            </li>
                        </ul>
                        <div className="form-inline my-2 my-lg-0">
                            <div className="input-group ">
                                <input className="form-control mr-sm-2"
                                       type="text"
                                       placeholder="Event Name"
                                       onKeyDown={this.detectEnter}
                                       ref={(fld) => {this.eventFld = fld}} />
                                <i className="input-group-btn btn btn-primary ml-1"
                                   onClick={this.createEvent}><i className="fa fa-plus"></i></i>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>);
        }
        return (
        <nav className="navbar navbar-expand-lg navbar-light
                        bg-light rounded mb-4">
            <div className="container">
                <Link className="navbar-brand" to="/">Carve</Link>
                <button className="navbar-toggler"
                      type="button"
                      data-toggle="collapse"
                      data-target="#courseManagerNavFields"
                      aria-controls="courseManagerNavFields"
                      aria-expanded="false"
                      aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="courseManagerNavFields">
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                            <Link to="/login" className="nav-link">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/register" className="nav-link">Register</Link>
                        </li>
                    </ul>
                </div>
            </div>
    </nav>);
    }
}