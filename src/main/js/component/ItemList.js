import React from 'react';
import {Link} from 'react-router-dom';

import ItemService from '../service/ItemService';

import UnitConversionUtil from '../util/UnitConversionUtil';

import ItemRow from './ItemRow';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.state.items = props.itemList;

        this.detectEnter = this.detectEnter.bind(this);
        this.addItem = this.addItem.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        prevState.items = nextProps.itemList;
        return prevState;
    }

    detectEnter(e) {
        if (e.keyCode === 13) {
          this.addItem();
        }
    }

    addItem() {
        return ItemService.getInstance().createItem(this.props.parent.state.event.eventId, {
            name: this.nameFld.value,
            price: 0,
            splits: []
        }).then((item) => {
            this.props.parent.getEvent(this.props.parent.state.event.eventId);
        });
    }

    updateItem(item) {
        return ItemService.getInstance().putItem(item).then(() => {
            this.props.parent.getEvent(this.props.parent.state.event.eventId);
        });
    }

    deleteItem(item) {
        return ItemService.getInstance().deleteItem(item.itemId).then(() => {
            this.props.parent.getEvent(this.props.parent.state.event.eventId);
        })
    }

    render() {
        return (
        <div>
            <ul className="list-group">
                {this.state.items.map((item) => {
                    return (
                    <ItemRow key={"" + ":" + item.itemId + ":"}
                             itemId={item.itemId}
                             parent={this}/>
                    );
                })}
                <li className="list-group-item" key="addUser">
                    <div className="input-group ">
                        <input className="form-control mr-sm-2"
                               type="text"
                               placeholder="Item Name"
                               onKeyDown={this.detectEnter}
                               ref={(fld) => {this.nameFld = fld}} />
                        <i className="input-group-btn btn btn-primary ml-1"
                           onClick={this.addItem}><i className="fa fa-plus"></i></i>
                    </div>
                </li>
            </ul>
        </div>
        );
    }
}