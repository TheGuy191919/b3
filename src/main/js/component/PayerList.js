import React from 'react';
import {Link} from 'react-router-dom';

import UserService from '../service/UserService';
import PayerService from '../service/PayerService';

import PayerRow from './PayerRow';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.state.payers = props.payerList;

        this.detectEnter = this.detectEnter.bind(this);
        this.addPayer = this.addPayer.bind(this);
        this.updatePayer = this.updatePayer.bind(this);
        this.deletePayer = this.deletePayer.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        prevState.payers = nextProps.payerList;
        return prevState;
    }

    detectEnter(e) {
        if (e.keyCode === 13) {
          this.addPayer();
        }
    }

    addPayer() {
        let user = this.props.parent.state.event.users.reduce((acc, curr) => {
            if (curr.handle === this.handleFld.value) {
                return curr;
            }
            return acc;
        }, null);
        if (user === null) {
            window.alert("User not part of event");
            return;
        }
        return PayerService.getInstance().createPayer(this.props.parent.state.event.eventId, {
            user: user,
            amount: this.amountFld.value || 0
        }).then((payer) => {
            this.props.parent.getEvent(this.props.parent.state.event.eventId);
        });
    }

    updatePayer(payer) {
        return PayerService.getInstance().putPayer(payer).then((payer) => {
            this.props.parent.getEvent(this.props.parent.state.event.eventId);
        });
    }

    deletePayer(payerId) {
        return PayerService.getInstance().deletePayer(payerId).then(() => {
            this.props.parent.getEvent(this.props.parent.state.event.eventId);
        });
    }

    render() {
        return (
        <div>
            <ul className="list-group">
                {this.state.payers.map((payer) => {
                    return (
                    <PayerRow parent={this}
                              payer={payer}
                              key={payer.payerId + ":" + payer.amount}/>
                    );
                })}
                <li className="list-group-item" key="addUser">
                    <div className="input-group ">
                        <input className="form-control mr-sm-2"
                               type="text"
                               placeholder="handle"
                               onKeyDown={this.detectEnter}
                               ref={(fld) => {this.handleFld = fld}} />
                        <input className="form-control mr-sm-2"
                               type="text"
                               placeholder="Amount"
                               onKeyDown={this.detectEnter}
                               ref={(fld) => {this.amountFld = fld}} />
                        <i className="input-group-btn btn btn-primary ml-1"
                           onClick={this.addPayer}><i className="fa fa-plus"></i></i>
                    </div>
                </li>
            </ul>
        </div>
        );
    }
}