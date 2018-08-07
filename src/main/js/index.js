import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker.js';

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/" component={Home} />
        </Switch>
    </Router>,
    document.getElementById('react'));

registerServiceWorker();
