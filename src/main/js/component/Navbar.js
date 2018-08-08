import React from 'react';
import {Link} from 'react-router-dom';

export default class extends React.Component{
    render() {
        return (
        <nav className="navbar navbar-expand-lg navbar-light
                        bg-light rounded mb-4">
            <div className="container">
                <Link className="navbar-brand" to="/">Carve</Link>
                <button className="navbar-toggler"
                      type="button"
                      data-toggle="collapse"
                      data-target="#courseManagerNavFields"
                      aria-controls="courseManagerNavFields"
                      aria-expanded="false"
                      aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="courseManagerNavFields">
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                            <Link to="/login" className="nav-link">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/register" className="nav-link">Register</Link>
                        </li>
                    </ul>
                    {/*<div className="form-inline my-2 my-lg-0">
                        <div className="input-group ">
                            <input className="form-control mr-sm-2"
                                   type="text"
                                   placeholder="Course Name"
                                   onKeyDown={this.detectEnter}
                                   ref={(fld) => {this.courseFld = fld}} />
                            <i className="input-group-btn btn btn-primary ml-1"
                               onClick={this.createCourse}><i className="fa fa-plus"></i></i>
                        </div>
                    </div>*/}
                </div>
            </div>
    </nav>);
    }
}