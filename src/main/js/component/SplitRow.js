import React from 'react';
import {Link} from 'react-router-dom';

import ItemService from '../service/ItemService';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.state.edit = false;
        this.state.split = props.split;

        this.setEdit = this.setEdit.bind(this);
        this.updateSplit = this.updateSplit.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        prevState.split = nextProps.split;
        return prevState;
    }

    setEdit(bool) {
        this.setState((prevState) => {
            prevState.edit = bool;
            return prevState;
        });
    }

    updateSplit() {
         var split = Object.assign({}, this.state.split);
         split.weight = this.weightField.value;
         this.props.parent.updateSplit(split)
             .then(() => {this.setEdit(false);});
    }

    render() {
        if (this.state.edit) {
            return (
            <li className="list-group-item">
                <div className="input-group my-2 my-lg-0 text-nowrap">
                  {this.state.split.user.handle}
                  <input className="form-control mr-sm-2"
                         type="text"
                         placeholder="Name"
                         defaultValue={this.state.split.weight}
                         onKeyDown={this.detectEnter}
                         ref={(fld) => {this.weightField = fld}} />
                  &nbsp;
                  <i className="input-group-btn btn btn-primary ml-1"
                     onClick={this.updateSplit}><i className="fa fa-check"></i></i>
                </div>
            </li>
            );
        }
        return (
        <li className="list-group-item">
            {this.state.split.user.handle} : Weight{this.state.split.weight}
            <div className="float-right text-nowrap">
               <i className="fa fa-edit fa-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.setEdit(true);}}></i>
               <i className="fa fa-close fa-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.props.parent.deleteSplit(this.state.split.splitId);
                  }}></i>
            </div>
        </li>
        );
    }
}