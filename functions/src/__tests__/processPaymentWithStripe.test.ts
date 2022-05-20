import { processPaymentWithStripe } from "../services";
import * as cart from "./fakeData/cart.json";
// import { config } from "firebase-functions";
import Stripe from "stripe";

// const stripeAccount = config().stripe.test_key || process.env.STRIPE_SECRET;

describe("Payment Processing", () => {
  test("returns an object with charge and status", async () => {
    const response = await processPaymentWithStripe(
      new Stripe("key", {
        apiVersion: "2020-08-27",
      }),
      cart,
      "cartId"
    );
    expect(response).toHaveProperty("charge");
    expect(response).toHaveProperty("status");
  });
});
