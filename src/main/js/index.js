import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker.js';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Home from './component/Home';
import Register from './component/Register';
import Login from './component/Login';
import Profile from './component/Profile';

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/profile" component={Profile} />
        </Switch>
    </Router>,
    document.getElementById('react'));

registerServiceWorker();
