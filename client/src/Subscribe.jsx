import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { withRouter } from "react-router-dom";
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Redirect } from "react-router-dom";

const Subscribe = ({ location }) => {
  console.log(location);

  // Initialize an instance of stripe.
  const stripe = useStripe();
  console.log(stripe);
  const elements = useElements();
  // Get the lookup key for the price from the previous page redirect.
  const [clientSecret] = useState(location.state.clientSecret);
  const [subscriptionId] = useState(location.state.subscriptionId);
  const [name, setName] = useState("Jenny Rosen");
  const [messages, _setMessages] = useState("");
  const [paymentIntent, setPaymentIntent] = useState();

  // helper for displaying status messages.
  const setMessage = (message) => {
    _setMessages(`${messages}\n\n${message}`);
  };

  if (!stripe || !elements) {
    // Stripe.js has not loaded yet. Make sure to disable
    // form submission until Stripe.js has loaded.
    return "";
  }

  // When the subscribe-form is submitted we do a few things:
  //
  //   1. Tokenize the payment method
  //   2. Create the subscription
  //   3. Handle any next actions like 3D Secure that are required for SCA.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement);

    // Use card Element to tokenize payment details
    let { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: name,
            email: "johndoeuser@yopmail.com",
            address: {
              city: "City", // Replace with the actual city
              country: "US", // Replace with the actual country
              line1: "Address Line 1", // Replace with the actual address line 1
              line2: "Address Line 2", // Replace with the actual address line 2
              postal_code: "12345", // Replace with the actual postal code
              state: "State", // Replace with the actual state
            },
          },
        },
      }
    );
    console.log(error);
    console.log(paymentIntent);
    if (error) {
      // show error and collect new card details.
      setMessage(error.message);
      return;
    }
    setPaymentIntent(paymentIntent);
  };

  if (paymentIntent && paymentIntent.status === "succeeded") {
    return <Redirect to={{ pathname: "/account" }} />;
  }

  return (
    <>
      <h1>Subscribe</h1>

      <p>
        Try the successful test card: <span>4242424242424242</span>.
      </p>

      <p>
        Try the test card that requires SCA: <span>4000002500003155</span>.
      </p>

      <p>
        Use any <i>future</i> expiry date, CVC,5 digit postal code
      </p>

      <hr />

      <form onSubmit={handleSubmit}>
        <label>
          Full name
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <CardElement />
        {/* <form id="payment-form" onSubmit={handleSubmit}>
                        <PaymentElement id="payment-element" options={paymentElementOptions} />
                        <button disabled={isLoading || !stripe || !elements} id="submit">
                            <span id="button-text">
                                {isLoading ? (
                                    <div className="spinner" id="spinner"></div>
                                ) : (
                                    "Pay now"
                                )}
                            </span>
                        </button>
                        {/* Show any error or success messages */}
        {/* {message && <div id="payment-message">{message}</div>} */}
        {/* </form>  */}
        <button>Subscribe</button>

        <div>{messages}</div>
      </form>
    </>
  );
};

export default withRouter(Subscribe);
