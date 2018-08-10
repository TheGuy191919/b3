import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker.js';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Home from './component/Home';
import Register from './component/Register';
import LoginPage from './component/LoginPage';
import Profile from './component/Profile';
import Event from './component/Event';

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={LoginPage} />
            <Route path="/profile" component={Profile} />
            <Route path="/event/:eventId" component={Event} />
        </Switch>
    </Router>,
    document.getElementById('react'));

registerServiceWorker();
