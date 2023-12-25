import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/Cards/CheckoutForm";
import getStripe from "@/lib/stripe";
import { useEffect } from "react";
import axios from "axios";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = getStripe
export default function App() {
  const [clientSecret, setClientSecret] = React.useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    // fetch("/api/create-payment-intent", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
    // })
    //   .then((res) => res.json())
    //   .then((data) => setClientSecret(data.clientSecret));
        axios
          .post("/api/stripe/create-payment-intent", {
            tushar: "puri",
          })
          .then((res) => {
           console.log(res);
           setClientSecret(res.data.clientSecret);
          })
          .catch((error) => console.log(error.message));
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options: any = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise()}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}