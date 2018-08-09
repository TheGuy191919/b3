import React from 'react';
import {Link} from 'react-router-dom';

import UserService from '../service/UserService';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.state.users = props.parent.state.event.users;

        this.addMember = this.addMember.bind(this);
    }

    detectEnter(e) {
        if (e.keyCode === 13) {
          this.addMember();
        }
    }

    addMember() {
        UserService.getInstance().searchUserByHandle(this.handleFld.value).then((user) => {
            console.log(user);
            this.props.parent.setState((prevState, props) => {
                prevState.
            });
        }).catch(() => {
            window.alert("User not found");
        });
    }

    render() {
        return (
        <div>
            <ul className="list-group">
                {this.state.users.map((user) => {
                    return (
                    <li className="list-group-item" key={user.handle}>
                        handle: {user.handle}
                    </li>
                    );
                })}
                <li className="list-group-item" key="addUser">
                    <div className="input-group ">
                        <input className="form-control mr-sm-2"
                               type="text"
                               placeholder="Event Name"
                               onKeyDown={this.detectEnter}
                               ref={(fld) => {this.handleFld = fld}} />
                        <i className="input-group-btn btn btn-primary ml-1"
                           onClick={this.addMember}><i className="fa fa-plus"></i></i>
                    </div>
                </li>
            </ul>
        </div>
        );
    }
}