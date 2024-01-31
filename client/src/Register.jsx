import React, { useState } from 'react';
import './App.css';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

const Register = (props) => {
    const [email, setEmail] = useState('jenny.rosen@example.com');
    const [customer, setCustomer] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // const { customer } = await axios.post('http://localhost:5000/create-customer', {
        //     method: 'post',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         email: email,
        //     }),
        // }).then(r => r.json());

        // setCustomer(customer);
        const result = await axios.post('http://localhost:5000/create-customer', {
            email: email
        })
        console.log(result)
        localStorage.setItem('newCustomer', JSON.stringify(result?.data?.customer))
        setCustomer(result?.data?.customer)
    };

    if (customer) {
        return <Redirect to={{ pathname: '/prices' }} />
    }

    return (
        <main>
            <h1>Sample Photo Service</h1>

            <img src="https://picsum.photos/280/320?random=4" alt="picsum generated" width="140" height="160" />

            <p>
                Unlimited photo hosting, and more. Cancel anytime.
            </p>

            <form onSubmit={handleSubmit}>
                <label>
                    Email
                    <input
                        type="text"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                </label>

                <button type="submit">
                    Register
                </button>
            </form>
        </main>
    );
}

export default Register;