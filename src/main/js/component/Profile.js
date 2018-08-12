import React from 'react';
import {Link, Redirect} from 'react-router-dom';

import UserService from '../service/UserService';

import Navbar from './Navbar.js';

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {};
        this.state.user = null;
        this.state.errUpdate = false;
        this.state.redir = null;

        this.getUser = this.getUser.bind(this);
        this.logout = this.logout.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.detectEnter = this.detectEnter.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    componentDidMount() {
        this.getUser();
    }

    detectEnter(e) {
        if (e.keyCode === 13) {
          this.login();
        }
    }

    logout() {
        UserService.getInstance().logout().then(() => {
            this.setState((prevState) => {
                prevState.redir = "/";
                return prevState;
            });
        })
    }

    getUser() {
        UserService.getInstance().currentUser()
        .then((user) => {
            this.setState((prevState, props) => {
                prevState.user = user;
                if (user !== null && prevState.user.name === null) {
                    prevState.user.name = "";
                }
                if (user !== null && prevState.user.email === null) {
                    prevState.user.email = "";
                }
                return prevState;
            })
        });
    }

    updateUser() {
        UserService.getInstance().updateUser({
            email: this.emailFld.value,
            handle: this.state.user.handle,
            name: this.nameFld.value,
            paymentsFrom: this.state.user.paymentsFrom,
            paymentsTo: this.state.user.paymentsTo,
            userId: this.state.user.userId
        })
        .then((user) => {
            window.alert("Profile updated");
            this.setState((prevState, props) => {
                prevState.user = user;
                return prevState;
            })
        });
    }

    changePassword() {
        UserService.getInstance().changePassword({
            password: this.passwordFld.value,
            userId: this.state.user.userId
        })
        .then(() => {
            window.alert("Password changed");
        });

    }

    render() {
        if (this.state.redir) {
            return <Redirect to={this.state.redir} />
        }
        if (this.state.user === null) {
            return <div><Navbar /></div>;
        }
        return (
        <div>
            <Navbar />
            <div className="container" id="wbdv-page">
                <div className="text-center mb-4">
                    <h1>Profile</h1>
                </div>
                {this.state.errUpdate &&
                <div className="alert alert-warning">
                    <strong>Warning!</strong> Cannot Update.
                </div>
                }
                <div className="form-horizontal">
                <div className="form-group">
                    <label className="control-label" htmlFor="handleFld">
                        handle
                    </label>
                    <div className="">
                      <input type="text"
                             placeholder="handle"
                             id="handleFld"
                             className="form-control"
                             value={this.state.user.handle}
                             ref={(fld) => {this.handleFld = fld}}
                             readOnly />
                    </div>
                </div>

                <div className="form-group">
                    <label className="control-label" htmlFor="nameFld">
                        Name
                    </label>
                    <div className="">
                      <input type="text"
                             placeholder="Name"
                             id="nameFld"
                             className="form-control"
                             ref={(fld) => {this.nameFld = fld}}
                             defaultValue={this.state.user.name}/>
                    </div>
                </div>

                <div className="form-group">
                    <label className="control-label" htmlFor="emailFld">
                        Email
                    </label>
                    <div className="">
                      <input type="email"
                             placeholder="Email"
                             id="emailFld"
                             className="form-control"
                             defaultValue={this.state.user.email}
                             ref={(fld) => {this.emailFld = fld}}/>
                    </div>
                </div>
                <div className="">
                  <button id="updateBtn"
                          className="btn btn-lg btn-danger btn-block"
                          onClick={this.updateUser}>
                      Update profile
                  </button>

                    <div className="mt-2 form-group">
                        <label className="control-label" htmlFor="passwordFld">
                            Password
                        </label>
                        <div className="input-group">
                            <input type="password"
                                   placeholder="password"
                                   id="passwordFld"
                                   className="form-control"
                                   onKeyDown={this.detectEnter}
                                   ref={(fld) => {this.passwordFld = fld}}/>
                            <span className="input-group-btn">
                                <button id="updatePassBtn"
                                        className="btn btn-danger ml-2"
                                        onClick={this.changePassword}>
                                    Change
                                </button>
                            </span>
                        </div>
                    </div>

                  <button id="logoutBtn"
                          className="btn btn-lg btn-warning btn-block"
                          onClick={this.logout}>
                      Logout
                  </button>
                </div>
              </div>
            </div>
        </div>);
    }
}