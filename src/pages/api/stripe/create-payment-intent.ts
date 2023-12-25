import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from 'stripe'
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '' ,{
    apiVersion: '2023-10-16',
    appInfo: {
        name: 'Cloud Stash',
        version: '0.1.0k'
    },
    typescript: true,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {

    const { items } = req.body;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 300,
        currency: 'usd',
        automatic_payment_methods: {
        enabled: true,
        },
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error in Payment:", error);
    throw error; // Propagate the error for better error handling
  }
}
