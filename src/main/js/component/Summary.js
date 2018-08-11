import React from 'react';
import {Link, Redirect} from 'react-router-dom';

import UserService from '../service/UserService';
import PaymentService from '../service/PaymentService';

import UnitConversionUtil from '../util/UnitConversionUtil';

import Navbar from './Navbar.js';

class PaymentRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.user = props.user;
        this.state.payment = props.payment;
    }

    static getDerivedStateFromProps(props, state) {
        state.user = props.user;
        state.payment = props.payment;
        return state;
    }

    render() {
        if (this.state.user.handle === this.state.payment.payeeUser.handle) {
            return (<li className="list-group-item">{this.state.payment.payerUser.handle} paid us {UnitConversionUtil.getInstance().intToStr(this.state.payment.amount)} on {new Date(this.state.payment.lastEditTime.split('.')[0] + "Z").toLocaleString()}</li>);
        }
        return (
        <li className="list-group-item">Paid {UnitConversionUtil.getInstance().intToStr(this.state.payment.amount)} to {this.state.payment.payeeUser.handle} on {new Date(this.state.payment.lastEditTime.split('.')[0] + "Z").toLocaleString()}
            <div className="float-right text-nowrap">
               <i className="fa fa-close fa-lg"
                  onClick={() => {this.props.parent.deletePayment(this.state.payment.paymentId)}}></i>
            </div>
        </li>);

    }
}

class EventSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.event = props.event;
        this.state.calculation = props.calculation;
    }

    static getDerivedStateFromProps(props, state) {
        state.event = props.event;
        state.calculation = props.calculation;
        state.statements = [];

        let event = state.calculation;
        for (var owerKey in event) {
            if (event.hasOwnProperty(owerKey)) {
                for (var payerKey in event[owerKey]) {
                    if (event[owerKey].hasOwnProperty(payerKey)) {
                        state.statements.push("" + owerKey + " spent " + " $" + UnitConversionUtil.getInstance().intToStr(event[owerKey][payerKey]) + " from " + payerKey);
                    }
                }
            }
        }

        return state;
    }

    render() {
        let event = this.state.event;
        return (
        <li className="list-group-item">
            <h4>{this.state.event.name}</h4>
            <small>Created: {new Date(this.state.event.createTime.split('.')[0] + "Z").toLocaleString()}</small>
            <ul className="list-group">
                {this.state.statements.map((statement) => {
                    return (<li className="list-group-item"
                                key={statement}>{statement}</li>);
                })}
            </ul>
        </li>
        );
    }
}

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.user = null;
        this.state.userLoaded = false;
        this.state.events = null;
        this.state.eventLoaded = false;
        this.state.payer = null;
        this.state.payerLoaded = false;
        this.state.payee = null;
        this.state.payeeLoaded = false;

        this.calculated = null;

        this.eventListener = this.eventListener.bind(this);
        this.getUser = this.getUser.bind(this);
        this.getEvents = this.getEvents.bind(this);
        this.addPayment = this.addPayment.bind(this);
        this.getPayerPayments = this.getPayerPayments.bind(this);
        this.getPayeePayments = this.getPayeePayments.bind(this);
        this.deletePayment = this.deletePayment.bind(this);
        this.updatePayment = this.updatePayment.bind(this);
        this.calculate = this.calculate.bind(this);
    }

    componentDidMount() {
        this.getUser();
        this.getEvents();
        this.getPayerPayments();
        this.getPayeePayments();
    }

    detectEnter(e) {
        if (e.keyCode === 13) {
          this.addPayment();
        }
    }

    eventListener() {

    }

    getUser() {
        UserService.getInstance().currentUser()
        .then((user) => {
            if (user === null) {
                this.setState((prevState, props) => {
                    this.calculated = null;
                    prevState.user = null;
                    prevState.userLoaded = true;
                    return prevState;
                });
                return;
            }
            this.setState((prevState, props) => {
                this.calculated = null;
                prevState.user = user;
                prevState.userLoaded = true
                return prevState;
            });
        });
    }

    getEvents() {
        UserService.getInstance().getEventForUser().then((events) => {
            if (events === null) {
                this.setState((prevState, props) => {
                    this.calculated = null;
                    prevState.events = null;
                    prevState.eventLoaded = true;
                    return prevState;
                });
                return;
            }
            events.sort((first, second) => {
                return new Date(second.createTime.split('.')[0] + "Z") - new Date(first.createTime.split('.')[0] + "Z");
            });
            this.setState((prevState, props) => {
                this.calculated = null;
                prevState.events = events;
                prevState.eventLoaded = true
                return prevState;
            });
        });
    }

    getPayerPayments() {
        UserService.getInstance().getPayerPaymentForUser().then((payer) => {
            if (payer === null) {
                this.setState((prevState, props) => {
                    this.calculated = null;
                    prevState.payer = null;
                    prevState.payerLoaded = true;
                    return prevState;
                });
                return;
            }
            this.setState((prevState, props) => {
                this.calculated = null;
                prevState.payer = payer;
                prevState.payerLoaded = true
                return prevState;
            });

        });
    }

    getPayeePayments() {
        UserService.getInstance().getPayeePaymentForUser().then((payer) => {
            if (payer === null) {
                this.setState((prevState, props) => {
                    this.calculated = null;
                    prevState.payee = null;
                    prevState.payeeLoaded = true;
                    return prevState;
                });
                return;
            }
            this.setState((prevState, props) => {
                this.calculated = null;
                prevState.payee = payer;
                prevState.payeeLoaded = true
                return prevState;
            });

        });
    }

    addPayment() {
        if (this.handleFld.value === this.state.user.handle) {
            window.alert("Cannot send to self");
            return;
        }
        UserService.getInstance().searchUserByHandle(this.handleFld.value).then((user) => {
            PaymentService.getInstance().createPayment({
                amount: UnitConversionUtil.getInstance().strToInt(this.amountFld.value),
                payerUser: this.state.user,
                payeeUser: user
            }).then(() => {
                this.getPayerPayments();
            });
        }).catch(() => {
            window.alert("User not found");
        });
    }

    deletePayment(paymentId) {
        PaymentService.getInstance().deletePayment(paymentId).then(() => {
            this.getPayerPayments();
        });
    }

    updatePayment() {
    }

    calculate() {
        if (this.calculated !== null) {
            return;
        }
        this.calculated = {};
        this.calculated.sortedpayments = this.state.payee.concat(this.state.payer);
        this.calculated.sortedpayments.sort((first, second) => {
            return new Date(second.lastEditTime.split('.')[0] + "Z") - new Date(first.lastEditTime.split('.')[0] + "Z");
        });
        this.calculated.events = this.state.events.map((event) => {
            let total = event.tip + event.tax;
            let totalPreTax = 0;
            let totalOwing = {};
            event.users.forEach((user) => {
                totalOwing[user.handle] = 0;
            });
            event.items.forEach((item) => {
                total = total + item.price;
                totalPreTax = totalPreTax + item.price;
                let totalWeight = item.splits.reduce((acc, split) => {
                    return acc + split.weight;
                }, 0);
                item.splits.forEach((split) => {
                    totalOwing[split.user.handle] = totalOwing[split.user.handle] + item.price * split.weight / totalWeight;
                });
            });
            event.users.forEach((user) => {
                totalOwing[user.handle] = totalOwing[user.handle] + (event.tip + event.tax) * totalOwing[user.handle] / totalPreTax;
            });
            let totalPaid = event.payers.reduce((acc, payer) => {return acc + payer.amount}, 0);
            //totalOwingToPayer[owerName][payerName] to get how much ower owes payer
            let totalOwingToPayer = {};
            event.users.forEach((user) => {
                totalOwingToPayer[user.handle] = {};
                event.payers.forEach((payer) => {
                    totalOwingToPayer[user.handle][payer.user.handle] = totalOwing[user.handle] * payer.amount / totalPaid;
                });
            });
            /*event.payers.forEach((payer) => {
                totalOwingToPayer[payer.user.handle] = {};
                event.users.forEach((user) => {
                    totalOwingToPayer[payer.user.handle][user.handle] = totalOwing[user.handle] * payer.amount / totalPaid;
                });
            });*/
            return totalOwingToPayer;
        });
        //How much this user owe to other users
        this.calculated.totaledOwing = {};
        this.calculated.events.forEach((event) => {
            for (var owerKey in event) {
                if (event.hasOwnProperty(owerKey)) {
                    for (var payerKey in event[owerKey]) {
                        if (event[owerKey].hasOwnProperty(payerKey)) {
                            if (payerKey === this.state.user.handle) {
                                this.calculated.totaledOwing[owerKey] = (this.calculated.totaledOwing[owerKey] || 0) - event[owerKey][payerKey];
                            }
                            if (owerKey === this.state.user.handle) {
                                this.calculated.totaledOwing[payerKey] = (this.calculated.totaledOwing[payerKey] || 0) + event[owerKey][payerKey];
                            }
                        }
                    }
                }
            }
        });
        //Subtracting already paid
        this.state.payer.forEach((payment) => {
            this.calculated.totaledOwing[payment.payeeUser.handle] = (this.calculated.totaledOwing[payment.payeeUser.handle] || 0) - payment.amount;
        });
        //Add other payments
        this.state.payee.forEach((payment) => {
            this.calculated.totaledOwing[payment.payerUser.handle] = (this.calculated.totaledOwing[payment.payerUser.handle] || 0) + payment.amount;
        });
    }

    render() {
        if (!this.state.eventLoaded || !this.state.payerLoaded || !this.state.payeeLoaded) {
            return null;
        }
        if (this.state.events === null || this.state.payer === null || this.state.payee === null) {
            return <Redirect to="/" />;
        }
        this.calculate();
        return (
        <div className="container">
            <Navbar eventListener={this.eventListener}/>
            <div className="">
                <h3>Summary</h3>
                <div className="p-2 border rounded">
                    <h4>Add Payment</h4>
                    <div className="form-group row">
                        <label htmlFor="inputPay" className="col-sm-2 col-form-label">Pay to</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" id="inputPay" placeholder="Handle"
                                   onKeyDown={this.detectEnter}
                                   ref={(fld) => {this.handleFld = fld}}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="inputText" className="col-sm-2 col-form-label">Amount</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" id="inputText" placeholder="Amount"
                                   onKeyDown={this.detectEnter}
                                   ref={(fld) => {this.amountFld = fld}}/>
                        </div>
                    </div>
                    <div>
                        <button className="btn btn-lg btn-primary btn-block"
                                onClick={this.addPayment}>
                            Add Payment
                        </button>
                    </div>
                </div>
                <div>
                    <h5>Owings</h5>
                    {(() => {
                        let statements = [];
                        for (var handleKey in this.calculated.totaledOwing) {
                            if (this.calculated.totaledOwing.hasOwnProperty(handleKey)) {
                                if (handleKey === this.state.user.handle) {
                                    //Nothing
                                } else if (this.calculated.totaledOwing[handleKey] > 0) {
                                    statements.push('You owe "' + handleKey + '" $' + UnitConversionUtil.getInstance().intToStr(this.calculated.totaledOwing[handleKey]));
                                } else if (this.calculated.totaledOwing[handleKey] < 0) {
                                    statements.push('"' + handleKey + '"' + " owes you $" + UnitConversionUtil.getInstance().intToStr(0 - this.calculated.totaledOwing[handleKey]));
                                } else {
                                    statements.push('Square with "' + handleKey + '"');
                                }
                            }
                        }
                        if (statements.length === 0) {
                            return <p className="ml-3">Nothing here yet</p>;
                        }
                        return (<ul className="list-group">{statements.map((statement) => {
                            return (<li className="list-group-item"
                                        key={statement}>{statement}</li>);
                        })}</ul>);
                    })()}
                </div>
                <div>
                    <h5>Payments</h5>
                    {this.calculated.sortedpayments.length === 0 &&
                        <p className="ml-3">Nothing here yet</p>}
                    {this.calculated.sortedpayments.map((payment) => {
                        return <PaymentRow payment={payment}
                                           user={this.state.user}
                                           parent={this}
                                           key={payment.paymentId} />
                    })}
                </div>
                <div>
                    <h5>Events</h5>
                    {this.state.events.length === 0 &&
                        <p className="ml-3">Nothing here yet</p>}
                    {this.state.events.map((event, i) => {
                        return <EventSummary event={event}
                                             calculation={this.calculated.events[i]}
                                             key={event.eventId}/>;
                    })}
                </div>
            </div>
        </div>
        );
    }
}