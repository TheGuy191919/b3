import React from 'react';
import {Link} from 'react-router-dom';

import UserService from '../service/UserService';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.state.user = null;

        this.getUser = this.getUser.bind(this);
    }

    componentDidMount() {
        this.getUser();
    }

    getUser() {
        UserService.getInstance().currentUser()
        .then((user) => {
            this.setState((prevState, props) => {
                prevState.user = user;
                return prevState;
            })
        });
    }

    render() {
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
                                <Link to="profile" className="nav-link">Profile</Link>
                            </li>
                        </ul>
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