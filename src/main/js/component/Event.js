import React from 'react';
import {Link, Redirect} from 'react-router-dom';

import EventService from '../service/EventService';

import UnitConversionUtil from '../util/UnitConversionUtil';

import Navbar from './Navbar.js';
import MemberList from './MemberList.js';
import ItemList from './ItemList.js';
import PayerList from './PayerList.js';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.state.event = null;
        this.state.error = null;
        this.state.editTax = false;
        this.state.editTip = false;
        this.state.redirHome = false;

        this.timeoutId = null;

        this.getEvent = this.getEvent.bind(this);
        this.putEvent = this.putEvent.bind(this);
        this.setEditTip = this.setEditTip.bind(this);
        this.setEditTax = this.setEditTax.bind(this);
        this.detectEnterTax = this.detectEnterTax.bind(this);
        this.detectEnterTip = this.detectEnterTip.bind(this);
        this.updateTax = this.updateTax.bind(this);
        this.updateTip = this.updateTip.bind(this);
    }

    componentDidMount() {
        this.getEvent(this.props.match.params['eventId']);
    }

    getEvent(eventId) {
        EventService.getInstance().getEvent(eventId)
        .then(event => {
            if (event === null) {
                this.setState((prevState, props) => {
                    prevState.redirHome = true;
                    return prevState;
                });
                return;
            }
            this.setState((prevState, props) => {
                prevState.event = event;
                return prevState;
            });
        }).catch(() => {
            this.setState((prevState, props) => {
                prevState.redirHome = true;
                return prevState;
            });
        });
    }

    putEvent() {
        EventService.getInstance().putEvent(this.state.event).then((event) => {
            this.setState((prevState, props) => {
                prevState.event = event;
                return prevState;
            });
        });
    }

    deleteEvent() {
        if (window.prompt("To delete, type event name below", "") !== this.state.event.name) {
            return;
        }
        EventService.getInstance().deleteEvent(this.state.event.eventId).then((event) => {
        }).catch(() => {
            this.setState((prevState, props) => {
                prevState.redirHome = true;
                return prevState;
            });
        });
    }

    setEditTip(bool) {
        if (this.state.editTax) {
            return;
        }
        this.setState((prevState, props) => {
            prevState.editTip = bool;
            prevState.editTax = false;
            return prevState;
        });
    }

    setEditTax(bool) {
        if (this.state.editTip) {
            return;
        }
        this.setState((prevState, props) => {
            prevState.editTip = false;
            prevState.editTax = bool;
            return prevState;
        });
    }

    detectEnterTax(e) {
        if (e.keyCode === 13) {
          this.updateTax();
        }
    }

    detectEnterTip(e) {
        if (e.keyCode === 13) {
          this.updateTip();
        }
    }

    updateTax() {
        var event = Object.assign({}, this.state.event);
        event.tax = UnitConversionUtil.getInstance().strToInt(this.taxAmountFld.value);
        EventService.getInstance().putEvent(event).then((event) => {
            this.setState((prevState, props) => {
                prevState.event = event;
                prevState.editTax = false;
                return prevState;
            });
        });
    }

    updateTip() {
        var event = Object.assign({}, this.state.event);
        event.tip = UnitConversionUtil.getInstance().strToInt(this.tipAmountFld.value);
        EventService.getInstance().putEvent(event).then((event) => {
            this.setState((prevState, props) => {
                prevState.event = event;
                prevState.editTip = false;
                return prevState;
            });
        });
    }

    render() {
        if (this.state.redirHome) {
            return (
            <Redirect to="/"/>);
        }
        if (this.state.error) {
            return (
            <div className="container">
               <Navbar />
               <h1>Error, please return to home page</h1>
               <h3>{this.state.error}</h3>
            </div>);
        }
        if (this.state.event === null) {
            return (
            <div className="container">
                <Navbar />
            </div>);
        }
        return (
        <div className="container">
            <Navbar />
            <div>
                <ul className="list-group">
                    <li className="list-group-item">
                        {this.state.event.name}
                        <div className="float-right">
                            <i className="fa fa-close fa-lg"
                                onClick={() => {this.deleteEvent()}}></i>
                        </div>
                    </li>
                </ul>
            </div>
            <div id="accordion">
              <div className="card">
                <div className="card-header bg-transparent" id="headingOne" data-toggle="collapse" data-target="#collapseOne">
                  Members
                </div>
                <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                  <div className="card-body p-1">
                    <MemberList parent={this} memberList={this.state.event.users}/>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header bg-transparent" id="headingTwo" data-toggle="collapse" data-target="#collapseTwo">
                  Items
                </div>
                <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                  <div className="card-body p-1">
                    <ItemList parent={this} itemList={this.state.event.items}/>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header bg-transparent" id="headingThree" data-toggle="collapse" data-target="#collapseThree">
                  Payers
                </div>
                <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                  <div className="card-body p-1">
                    <PayerList parent={this}
                               payerList={this.state.event.payers}/>
                  </div>
                </div>
              </div>
            </div>
            <div>
                <ul className="list-group">
                    {!this.state.editTip &&
                    <li className="list-group-item">
                        Tip: ${UnitConversionUtil.getInstance().intToStr(this.state.event.tip)}
                        <div className="float-right text-nowrap">
                           <i className="fa fa-edit fa-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                this.setEditTip(true);}}></i>
                        </div>
                    </li>}
                    {this.state.editTip &&
                    <li className="list-group-item">
                        <div className="input-group my-2 my-lg-0 text-nowrap">
                            <input className="form-control mr-sm-2"
                                 type="text"
                                 placeholder="Amount"
                                 defaultValue={UnitConversionUtil.getInstance().intToStr(this.state.event.tip)}
                                 onKeyDown={this.detectEnterTip}
                                 ref={(fld) => {this.tipAmountFld = fld}} />
                            &nbsp;
                            <i className="input-group-btn btn btn-primary ml-1"
                               onClick={this.updateTip}><i className="fa fa-check"></i></i>
                        </div>
                    </li>}
                    {!this.state.editTax &&
                    <li className="list-group-item">
                        Tax: ${UnitConversionUtil.getInstance().intToStr(this.state.event.tax)}
                        <div className="float-right text-nowrap">
                           <i className="fa fa-edit fa-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                this.setEditTax(true);}}></i>
                        </div>
                    </li>}
                    {this.state.editTax &&
                    <li className="list-group-item">
                        <div className="input-group my-2 my-lg-0 text-nowrap">
                            <input className="form-control mr-sm-2"
                                 type="text"
                                 placeholder="Amount"
                                 defaultValue={UnitConversionUtil.getInstance().intToStr(this.state.event.tax)}
                                 onKeyDown={this.detectEnterTax}
                                 ref={(fld) => {this.taxAmountFld = fld}} />
                            &nbsp;
                            <i className="input-group-btn btn btn-primary ml-1"
                               onClick={this.updateTax}><i className="fa fa-check"></i></i>
                        </div>
                    </li>}
                    <li className="list-group-item">
                        Total: ${UnitConversionUtil.getInstance().intToStr(this.state.event.tip + this.state.event.tax + this.state.event.items.reduce((acc, item) => {
                            return acc + item.price;
                        }, 0))}
                    </li>
                </ul>
            </div>
        </div>
        );
    }
}