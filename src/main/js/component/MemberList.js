import React from 'react';
import {Link} from 'react-router-dom';

import UserService from '../service/UserService';
import EventService from '../service/EventService';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.state.users = props.parent.state.event.users;

        this.addMember = this.addMember.bind(this);
        this.deleteMember = this.deleteMember.bind(this);
    }

    detectEnter(e) {
        if (e.keyCode === 13) {
          this.addMember();
        }
    }

    addMember() {
        UserService.getInstance().searchUserByHandle(this.handleFld.value).then((user) => {
            EventService.getInstance().addUserTOEvent(this.props.parent.state.event.eventId, user.userId).then(() => {
                this.props.parent.getEvent(this.props.parent.state.event.eventId);
            });
        }).catch(() => {
            window.alert("User not found");
        });
    }

    deleteMember(userId) {
        EventService.getInstance().removeUserFromEvent(this.props.parent.state.event.eventId, userId).then((event) => {
            console.log("making get event");
            this.props.parent.getEvent(this.props.parent.state.event.eventId);
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
                        {true &&
                        <div className="float-right">
                            <i className="fa fa-close fa-2x"
                                onClick={() => {this.deleteMember(user.userId)}}></i>
                        </div>
                        }
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