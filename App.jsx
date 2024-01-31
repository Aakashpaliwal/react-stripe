import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { Button } from "@mui/material";

// when you toggle to live mode, you should add the live publishale key.
const stripePromise = loadStripe(
  "pk_test_51KKj1USBYQWkn281Fj6uM70enwD19LAiWKNRm6qkXm93PbWn4QGyJWjJATsRHo5XSDJUX9ge0NEpFahuQdwYuOfj00x510qi1D"
);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function App() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    // fetch("http://localhost:5000/create-payment-intent", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
    //   // body: JSON.stringify({ id: 1, price: 1000, quantity: 1 })
    // })
    //   .then((res) =>  res?.json()).then((data) => setClientSecret(res?.data?.clientSecret))
    axios.post('http://localhost:5000/create-payment-intent', {
          items: [{id:"donation"}]
        }).then((res) => {
          console.log(res)
          setClientSecret(res?.data?.clientSecret);
        })
  }, []);

  // const paymentHandler = async () => {
  //   axios.post('http://localhost:5000/create-payment-intent', {
  //     items: [{id:"donation"}]
  //   }).then((res) => {
  //     console.log(res)
  //     setClientSecret(res?.data?.clientSecret);
  //   })
  // }

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Item>
              {/* <Elements stripe={stripePromise}>
                <PaymentForm />
              </Elements> */}
              {/* <Button onClick={() => {paymentHandler()}}>Pay</Button> */}
              {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                  <PaymentForm />
                </Elements>
              )}
            </Item>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default App;



//STRIPE CHECKOUT IMPLEMENTATION

// import React, { useState, useEffect } from "react";
// import "./App.css";
// import axios from "axios";

// const submitHandler = async (e) => {
//   e.preventDefault()
//   console.log('submit')    
//   let BODY = {
//     id:"pr_1234"
//   }
//   axios.post('http://localhost:5000/create-checkout-session', {
//     items: {id:"pr_1234"}
//     }).then((res) => {
//       console.log(res)
//       // setClientSecret(res?.data?.clientSecret);
//     })
// }

// const ProductDisplay = () => (
  
//   <section>
//     <div className="product">
//       <img
//         src="https://i.imgur.com/EHyR2nP.png"
//         alt="The cover of Stubborn Attachments"
//       />
//       <div className="description">
//       <h3>Stubborn Attachments</h3>
//       <h5>$20.00</h5>
//       </div>
//     </div>
//     <form onSubmit={(e) => submitHandler(e)}>
//       <button type="submit">
//         Checkout
//       </button>
//     </form>
//   </section>
// );

// const Message = ({ message }) => (
//   <section>
//     <p>{message}</p>
//   </section>
// );

// export default function App() {
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     // Check to see if this is a redirect back from Checkout
//     const query = new URLSearchParams(window.location.search);

//     if (query.get("success")) {
//       setMessage("Order placed! You will receive an email confirmation.");
//     }

//     if (query.get("canceled")) {
//       setMessage(
//         "Order canceled -- continue to shop around and checkout when you're ready."
//       );
//     }
//   }, []);

//   return message ? (
//     <Message message={message} />
//   ) : (
//     <ProductDisplay />
//   );
// }