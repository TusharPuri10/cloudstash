import { Stripe, loadStripe } from '@stripe/stripe-js';

type stripepromise = Stripe | PromiseLike<Stripe | null>;
let stripePromise: stripepromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export default getStripe;