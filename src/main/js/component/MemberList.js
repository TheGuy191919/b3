import React from 'react';
import {Link} from 'react-router-dom';

import UserService from '../service/UserService';
import EventService from '../service/EventService';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.state.users = this.props.memberList;
        this.state.user = null;
        this.state.showSuggestion = false;
        this.state.suggestedUsers = [];

        this.addMember = this.addMember.bind(this);
        this.deleteMember = this.deleteMember.bind(this);
        this.getUser = this.getUser.bind(this);
        this.detectEnter = this.detectEnter.bind(this);
        this.getSuggestion = this.getSuggestion.bind(this);
        this.toggleSS = this.toggleSS.bind(this);
        this.fillHandle = this.fillHandle.bind(this);
    }

    componentDidMount() {
        this.getUser();
        this.getSuggestion();
    }

    getSuggestion() {
        UserService.getInstance().getSuggestion()
        .then((suggestedUsers) => {
            this.setState((prevState, props) => {
                prevState.suggestedUsers = suggestedUsers;
                return prevState;
            })
        });
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

    static getDerivedStateFromProps(nextProps, prevState) {
        prevState.users = nextProps.memberList;
        return prevState;
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
        if (this.state.user.userId === userId && this.state.users.length === 1) {
            EventService.getInstance().deleteEvent(this.props.parent.state.event.eventId).then((event) => {
            }).catch(() => {
                this.props.parent.setState((prevState, props) => {
                    prevState.redirHome = true;
                    return prevState;
                });
            });
            return;
        }
        EventService.getInstance().removeUserFromEvent(this.props.parent.state.event.eventId, userId).then((event) => {
            this.props.parent.getEvent(this.props.parent.state.event.eventId);
        });
    }

    toggleSS() {
        this.setState((prevState, props) => {
            prevState.showSuggestion = !prevState.showSuggestion;
            return prevState;
        });
    }

    fillHandle(str) {
        this.handleFld.value = str;
    }

    render() {
        return (
        <div>
            <ul className="list-group">
                {this.state.users.map((user) => {
                    return (
                    <li className="list-group-item" key={user.handle}>
                        {user.handle}
                        {true &&
                        <div className="float-right">
                            <i className="fa fa-close fa-lg"
                                onClick={() => {this.deleteMember(user.userId)}}></i>
                        </div>
                        }
                    </li>
                    );
                })}
                <li className="list-group-item" key="addUser">
                    <div className="input-group ">
                        {!this.state.showSuggestion &&
                        <i className="fa fa-caret-up fa-lg pr-4"
                           onClick={this.toggleSS}></i>}
                        {this.state.showSuggestion &&
                        <i className="fa fa-caret-down fa-lg pr-4"
                           onClick={this.toggleSS}></i>}
                        <input className="form-control mr-sm-2"
                               type="text"
                               placeholder="Handle"
                               onKeyDown={this.detectEnter}
                               ref={(fld) => {this.handleFld = fld}} />
                        <i className="input-group-btn btn btn-primary ml-1"
                           onClick={this.addMember}><i className="fa fa-plus"></i></i>
                    </div>
                </li>
                {this.state.showSuggestion &&
                <li className="list-group-item"><h4>Suggestions</h4></li>}
                {this.state.showSuggestion &&
                this.state.suggestedUsers.filter((sUser) => {
                    if (this.state.users.find((existUser) => {
                        return existUser.userId === sUser.userId;
                    }) === undefined) {
                        return true;
                    }
                    return false;
                }).map((sUser) => {
                    return (
                    <li className="list-group-item"
                        onClick={() => {this.fillHandle(sUser.handle)}}>
                    {sUser.handle}
                    </li>
                    );
                })}
            </ul>
        </div>
        );
    }
}
