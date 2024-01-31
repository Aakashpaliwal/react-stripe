import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

const Prices = () => {
    const [prices, setPrices] = useState([]);
    const [subscriptionData, setSubscriptionData] = useState(null);

    useEffect(() => {
        const fetchPrices = async () => {
            const { prices } = await fetch('http://localhost:5000/config').then(r => r.json());
            console.log(prices)
            setPrices(prices);
            // const fetchResult = axios.get('http://localhost:5000/config')
            // console.log(fetchResult)
        };
        fetchPrices();
    }, [])

    const createSubscription = async (priceId) => {
        console.log(priceId)
        let customerId = JSON.parse(localStorage.getItem('newCustomer')).id
        // const result = await axios.post('http://localhost:5000/create-subscription', {
        //     priceId: priceId,
        //     customerId: customerId
        // })
        // console.log(result)
        const { subscriptionId, clientSecret } = await fetch('http://localhost:5000/create-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                priceId, customerId
            }),
        }).then(r => r.json());
        console.log(subscriptionId)
        // console.log(clientSecret)
        setSubscriptionData({ subscriptionId , clientSecret});
    }

    console.log(prices)

    if (subscriptionData) {
        return <Redirect to={{
            pathname: '/subscribe',
            state: subscriptionData
        }} />
    }



    return (
        <div>
            <h1>Select a plan</h1>

            <div className="price-list">
                {prices.map((price) => {
                    return (
                        <div key={price.id}>
                            <h3>{price.product.name}</h3>

                            <p>
                                ${price.unit_amount / 100} / month
                            </p>

                            <button onClick={() => createSubscription(price.id)}>
                                Select
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default withRouter(Prices);