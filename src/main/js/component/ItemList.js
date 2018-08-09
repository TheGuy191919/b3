import React from 'react';
import {Link} from 'react-router-dom';

import ItemService from '../service/ItemService';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.state.items = props.parent.state.event.items;

        this.addItem = this.addItem.bind(this);
    }

    detectEnter(e) {
        if (e.keyCode === 13) {
          this.addItem();
        }
    }

    addItem() {
        ItemService.getInstance().createItem(this.props.parent.state.event.eventId, {
            name: this.nameFld.value,
            price: 0,
            splits: this.props.parent.state.event.users.map(user => {
                return {
                    weight: 1,
                    user: user
                };
            })
        }).then((item) => {
            this.props.parent.setState((prevState, props) => {
                prevState.status = "pending";
                prevState.event.items.push(item);
                return prevState;
            });
        })
    }

    deleteItem(item) {
        ItemService.getInstance().deleteItem(item.itemId).then(() => {
            this.props.parent.setState((prevState, props) => {
                prevState.status = "pending";
                prevState.event.items.splice(prevState.event.items.indexOf(item), 1);
                return prevState;
            });
        })
    }

    render() {
        return (
        <div>
            <ul className="list-group">
                {this.state.items.map((item) => {
                    return (
                    <li className="list-group-item" key={"" + item.eventId + ":" + item.itemId + ":"}>
                        {item.name} : ${item.price}
                        <i className="fa fa-close fa-2x"
                            onClick={() => {this.deleteItem(item)}}></i>
                    </li>
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