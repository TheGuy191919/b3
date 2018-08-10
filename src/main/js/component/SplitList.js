import React from 'react';
import {Link} from 'react-router-dom';

import UserService from '../service/UserService';
import SplitService from '../service/SplitService';

import SplitRow from './SplitRow';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.state.splits = props.splits;

        this.addSplit = this.addSplit.bind(this);
        this.deleteSplit = this.deleteSplit.bind(this);
        this.updateSplit = this.updateSplit.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        prevState.splits = nextProps.splits;
        return prevState;
    }

    detectEnter(e) {
        if (e.keyCode === 13) {
          this.addSplit();
        }
    }

    addSplit() {
        let user = this.props.parent.props.parent.props.parent.state.event.users.reduce((acc, curr) => {
            if (curr.handle === this.handleFld.value) {
                return curr;
            }
            return acc;
        }, null);
        if (user === null) {
            window.alert("User not part of event");
            return;
        }
        return SplitService.getInstance().createSplit(this.props.parent.state.item.itemId, {
            user: user,
            weight: 1,
            item: this.props.parent.state.item
        }).then((item) => {
            this.props.parent.getItem();
        });
    }

    deleteSplit(splitId) {
        return SplitService.getInstance().deleteSplit(splitId).then(() => {
            this.props.parent.getItem();
        });

    }

    updateSplit(split) {
        return SplitService.getInstance().putSplit(split).then((item) => {
            this.props.parent.getItem();
        });
    }

    render() {
        return (
        <ul className="list-group"
            onClick={(e) => {
                e.stopPropagation();
            }}>
            {this.state.splits.map((split) => {
                return (
                <SplitRow parent={this}
                          split={split}
                          key={split.splitId + ":" + split.user.handle + ":" + split.weight}/>);
            })}
            <li className="list-group-item">
                <div className="input-group ">
                    <input className="form-control mr-sm-2"
                           type="text"
                           placeholder="Handle"
                           onKeyDown={this.detectEnter}
                           ref={(fld) => {this.handleFld = fld}} />
                    <i className="input-group-btn btn btn-primary ml-1"
                       onClick={this.addSplit}><i className="fa fa-plus"></i></i>
                </div>
            </li>
        </ul>
        );
    }
}