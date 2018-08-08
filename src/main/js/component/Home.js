import React from 'react';

import UserService from '../service/UserService';

import Navbar from './Navbar.js';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};

        this.getUser = this.getUser.bind(this);
    }

    componentDidMount() {
        this.getUser();
    }

    getUser() {
        UserService.getInstance()
    }

    render() {
        return <div className="container"><Navbar user={this.state.user} /><h1>Home</h1></div>;
    }
}