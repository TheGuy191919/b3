import React from 'react';
import {Link, Redirect} from 'react-router-dom';

import UserService from '../service/UserService';

import Navbar from './Navbar.js';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {}
        this.state.errMatch = false;
        this.state.errRegister = false;
        this.state.redToProfile = false;

        this.register = this.register.bind(this);
    }

    register() {
        if (this.passwordFld1.value !== this.passwordFld2.value) {
            this.setState((prevState, props) => {
                prevState.errMatch = true;
                prevState.errRegister = false;
                return prevState;
            });
            return;
        }
        UserService.getInstance().register({
            handle: this.handleFld.value,
            password: this.passwordFld1.value
        })
        .then(token => {
            if (token === null) {
                throw "Failed to logon";
            }
            console.log(token);
            this.setState((prevState, props) => {
                prevState.redToProfile = true;
                return prevState;
            })
        })
        .catch(err => {
            this.setState((prevState, props) => {
                prevState.errRegister = true;
                prevState.errMatch = false;
                return prevState;
            });
        });
    }

    render() {
        if (this.state.redToProfile) {
          return <Redirect to='/profile' />;
        }
        return (
        <div>
        <Navbar user={null} />
        <div className="container col-sm-3">
            <div className="text-center mb-4">
                <h1>Register</h1>
            </div>
            {this.state.errMatch &&
            <div className="alert alert-warning">
                <strong>Warning!</strong> Password no match.
            </div>
            }
            {this.state.errRegister &&
            <div className="alert alert-warning">
                <strong>Warning!</strong> Cannot Register.
            </div>
            }
        	<div className="form-horizontal">
            <div className="form-group">
                <label className="control-label" htmlFor="handleFld">
                    Handle
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
                      className="btn btn-lg btn-primary btn-block"
                      onClick={this.register}>
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