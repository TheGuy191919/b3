import React from 'react';
import {Link} from 'react-router-dom';

import Navbar from './Navbar.js';

export default class extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <div>
        <Navbar user={null} />
        <div className="container col-sm-3">
          <div className="text-center mb-4">
            	<h1>Register</h1>
          </div>
          <div className="alert alert-warning">
          	<strong>Warning!</strong> Password no match.
          </div>
          <div className="alert alert-warning">
          	<strong>Warning!</strong> Cannot Register.
          </div>
        	<div className="form-horizontal">
            <div className="form-group">
                <label className="control-label" htmlFor="handleFld">
                    Username
                </label>
                <div className="">
                  <input type="text"
                         placeholder="handle"
                         id="handleFld"
                         className="form-control"
                         ref={(fld) => {this.handleFld = fld}}/>
                </div>
            </div>

            <div className="form-group">
                <label className="control-label" htmlFor="passwordFld1">
                    Password
                </label>
                <div className="">
                  <input type="password"
                         placeholder="Password"
                         id="passwordFld1"
                         className="form-control"
                         ref={(fld) => {this.passwordFld1 = fld}}/>
                </div>
            </div>

            <div className="form-group">
                <label className="control-label" htmlFor="passwordFld2">
                    Password Again
                </label>
                <div className="">
                  <input type="password"
                         placeholder="Password Again"
                         id="passwordFld2"
                         className="form-control"
                         ref={(fld) => {this.passwordFld2 = fld}}/>
                </div>
            </div>
            <div className="">
              <button id="loginBtn"
                      className="btn btn-lg btn-primary btn-block">
                  Register
              </button>
              <Link to="/login" className="wbdv-link">
                  Login
              </Link>
            </div>
          </div>
        </div>
        </div>
        );
    }
}