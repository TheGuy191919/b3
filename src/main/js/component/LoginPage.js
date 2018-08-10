import React from 'react';

import Navbar from './Navbar.js';
import Login from './Login.js';

export default class extends React.Component{
    render() {
        return (
        <div>
        <Navbar user={null} />
        <Login />
        </div>
        );
    }
}