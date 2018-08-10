import React from 'react';
import {Link} from 'react-router-dom';

import ItemService from '../service/ItemService';

import SplitList from './SplitList';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.state.edit = false;
        this.state.item = null;
        this.state.showSplit = false;

        this.detectEnter = this.detectEnter.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.setEdit = this.setEdit.bind(this);
        this.getItem = this.getItem.bind(this);
    }

    componentDidMount() {
        this.getItem();
    }

    detectEnter(e) {
        if (e.keyCode === 13) {
          this.updateItem();
        }
    }

    getItem() {
        return ItemService.getInstance().getItem(this.props.itemId).then((item) => {
            this.setState((prevState, props) => {
                prevState.item = item;
                return prevState;
            });
        });
    }

    setEdit(bool) {
        this.setState((prevState) => {
            prevState.edit = bool;
            prevState.showSplit = false;
            return prevState;
        });
    }

    setShowSplit(bool) {
        this.setState((prevState) => {
            prevState.edit = false;
            prevState.showSplit = bool;
            return prevState;
        });
    }

    updateItem() {
         var item = Object.assign({}, this.state.item);
         item.name = this.nameFld.value;
         item.price = this.priceFld.value;
         this.props.parent.updateItem(item)
             .then(() => {this.setEdit(false);this.getItem()});
    }

    render() {
        if (this.state.item === null) {
            return null;
        }
        if (this.state.edit) {
            return (
            <li className="list-group-item">
                <div className="input-group my-2 my-lg-0 text-nowrap">
                  <input className="form-control mr-sm-2"
                         type="text"
                         placeholder="Name"
                         defaultValue={this.state.item.name}
                         onKeyDown={this.detectEnter}
                         ref={(fld) => {this.nameFld = fld}} />
                  <input className="form-control mr-sm-2"
                         type="text"
                         placeholder="Price"
                         defaultValue={this.state.item.price}
                         onKeyDown={this.detectEnter}
                         ref={(fld) => {this.priceFld = fld}} />
                  &nbsp;
                  <i className="input-group-btn btn btn-primary ml-1"
                     onClick={this.updateItem}><i className="fa fa-check"></i></i>
                </div>
            </li>
            );
        }
        return (
        <li className="list-group-item">
            <div onClick={(e) => {
                e.stopPropagation();
                this.setShowSplit(!this.state.showSplit);
            }}>
                {!this.state.showSplit &&
                <i className="fa fa-sort-asc fa-lg"></i>}
                {this.state.showSplit &&
                <i className="fa fa-sort-desc fa-lg"></i>}
                {this.state.item.name} : ${this.state.item.price}
                <div className="float-right text-nowrap">
                   <i className="fa fa-edit fa-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.setEdit(true);}}></i>
                   <i className="fa fa-close fa-lg"
                      onClick={() => {this.props.parent.deleteItem(this.state.item)}}></i>
                </div>
            </div>
            {this.state.showSplit &&
            <SplitList parent={this}
                       splits={this.state.item.splits}/>}
        </li>
        );
    }
}