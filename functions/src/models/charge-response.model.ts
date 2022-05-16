import Stripe from "stripe";

export type ChargeResponse = {
  charge: string | Stripe.Response<Stripe.Charge> | undefined;
  status: string;
};
