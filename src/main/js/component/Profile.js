import React from 'react';
import {Link} from 'react-router-dom';

import UserService from '../service/UserService';

import Navbar from './Navbar.js';

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {};
        this.state.user = null;
        this.state.errUpdate = false;

        this.getUser = this.getUser.bind(this);
        this.logout = this.logout.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }

    componentDidMount() {
        this.getUser();
    }

    logout() {

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

    render() {
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
                    <label className="control-label" htmlFor="passwordFld">
                        Password
                    </label>
                    <div className="">
                      <input type="password"
                             placeholder="password"
                             id="passwordFld"
                             className="form-control"
                             ref={(fld) => {this.passwordFld = fld}}
                             readOnly/>
                    </div>
                </div>

                <div className="form-group">
                    <label className="control-label" htmlFor="emailFld">
                        Email
                    </label>
                    <div className="">
                      <input type="text"
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
                      Update
                  </button>
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