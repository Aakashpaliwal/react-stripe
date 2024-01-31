import React from 'react';
import './App.css';
import { BrowserRouter as Switch, Route } from 'react-router-dom';

import Account from './Account';
import Cancel from './Cancel';
import Prices from './Prices';
import Register from './Register';
import Subscribe from './Subscribe';
import {
    Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe("pk_test_51KKj1USBYQWkn281Fj6uM70enwD19LAiWKNRm6qkXm93PbWn4QGyJWjJATsRHo5XSDJUX9ge0NEpFahuQdwYuOfj00x510qi1D");

// const appearance = {
//     theme: 'stripe',
// };

// const options = {
//     clientSecret,
//     appearance,
// };

function AnotherApp(props) {
    return (
        <Switch>
            <Route exact path="/">
                <Register />
            </Route>
            <Route path="/prices">
                <Prices />
            </Route>
            <Route path="/subscribe">
                <Elements stripe={stripePromise}>
                    <Subscribe />
                </Elements>
            </Route>
            <Route path="/account">
                <Account />
            </Route>
            <Route path="/cancel">
                <Cancel />
            </Route>
        </Switch>
    );
}

export default AnotherApp;