import React from 'react';
import {Link} from 'react-router-dom';

import UserService from '../service/UserService';
import PayerService from '../service/PayerService';

import UnitConversionUtil from '../util/UnitConversionUtil';

import PayerRow from './PayerRow';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.state.payer = props.payer;
        this.state.edit = false;

        this.detectEnter = this.detectEnter.bind(this);
        this.updatePayer = this.updatePayer.bind(this);
        this.setEdit = this.setEdit.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        prevState.payer = nextProps.payer;
        return prevState;
    }

    detectEnter(e) {
        if (e.keyCode === 13) {
          this.updatePayer();
        }
    }

    updatePayer() {
         var payer = Object.assign({}, this.state.payer);
         payer.amount = UnitConversionUtil.getInstance().strToInt(this.amountFld.value);
         this.props.parent.updatePayer(payer)
             .then(() => {this.setEdit(false);});
    }

    setEdit(bool) {
        this.setState((prevState) => {
            prevState.edit = bool;
            return prevState;
        });
    }

    render() {
        if (this.state.edit) {
            return (
            <li className="list-group-item" key={this.state.payer.payerId}>
                <div className="input-group my-2 my-lg-0 text-nowrap">
                  <input className="form-control mr-sm-2"
                         type="text"
                         placeholder="Amount"
                         defaultValue={UnitConversionUtil.getInstance().intToStr(this.state.payer.amount)}
                         onKeyDown={this.detectEnter}
                         ref={(fld) => {this.amountFld = fld}} />
                  &nbsp;
                  <i className="input-group-btn btn btn-primary ml-1"
                     onClick={this.updatePayer}><i className="fa fa-check"></i></i>
                </div>
            </li>
            );
        }
        return (
        <li className="list-group-item" key={this.state.payer.payerId}>
            {this.state.payer.user.handle} paid ${UnitConversionUtil.getInstance().intToStr(this.state.payer.amount)}
            <div className="float-right">
                <i className="fa fa-edit fa-lg"
                   onClick={(e) => {
                     e.stopPropagation();
                     this.setEdit(true);}}></i>
                <i className="fa fa-close fa-lg"
                    onClick={() => {this.props.parent.deletePayer(this.state.payer.payerId)}}></i>
            </div>
        </li>
        );
    }

}