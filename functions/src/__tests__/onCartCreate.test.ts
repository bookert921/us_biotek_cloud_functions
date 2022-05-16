import * as functions from "firebase-functions-test";
import * as cart from "./fakeData/cart.json";
import {
  WrappedFunction,
  WrappedScheduledFunction,
} from "firebase-functions-test/lib/main";

const testEnv = functions({ projectId: "cart-order-test" });
const GCLOUD_PROJECT = process.env.GCLOUD_PROJECT;
process.env.GCLOUD_PROJECT = "cart-order-test";
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

import { store } from "../api/db";

const settingsRef = store.collection("settings").doc("test");
const cartsRef = store.collection("carts").doc("test");
const ordersRef = store.collection("orders").doc("test");

import { onCartCreate } from "../api/db/carts/on-create";

let wrapped: WrappedFunction | WrappedScheduledFunction;

describe("OnCartCreate:Offline", () => {
  beforeAll(async () => {
    wrapped = testEnv.wrap(onCartCreate);
  });

  beforeEach(async () => {
    await testEnv.firestore.clearFirestoreData({
      projectId: "cart-order-test",
    });
    await settingsRef.create({
      [process.env.STRIPE_KEY_LOCATION as string]: "test",
    });
  });

  afterEach(async () => {
    if ((await cartsRef.get()).exists) {
      console.log("Deleting cartsRef!!!");
      await cartsRef.delete();
    }
    if ((await ordersRef.get()).exists) {
      console.log("Deleting ordersRef!!!");
      await ordersRef.delete();
    }
    if ((await settingsRef.get()).exists) {
      await settingsRef.delete();
    }
  });

  afterAll(async () => {
    testEnv.cleanup();
    process.env.GCLOUD_PROJECT = GCLOUD_PROJECT;
  });

  test("responds to submitted cart", async () => {
    await cartsRef.set(cart);

    const afterSnap = await cartsRef.get();

    await wrapped(afterSnap, { params: { id: "test" } });

    /* Cart is deleted therefore, orderRef will carry status. */
    const status = (await ordersRef.get()).get("cart.status");

    expect(status).toBe("Submitted");
  });

  test("does not tamper with non-'submitted' cart", async () => {
    const modifiedCart = { ...cart };
    modifiedCart.status = "Pending";
    await cartsRef.set(modifiedCart);

    const afterSnap = await cartsRef.get();
    await wrapped(afterSnap, { params: { id: "test" } });

    expect((await ordersRef.get()).exists).toBeFalsy();

    const status = (await cartsRef.get()).get("status");
    expect(status).not.toBe("Submitted");
  });

  test("removes private details from cart -> order", async () => {
    await cartsRef.set(cart);

    const afterSnap = await cartsRef.get();

    await wrapped(afterSnap, { params: { id: "test" } });

    const orderRef = (await ordersRef.get()).get("cart");
    const order = { ...cart };
    order.payment_details.cc_security_code = "";

    expect(orderRef).toEqual(order);
  });

  test("removes cart after order processed", async () => {
    await cartsRef.set(cart);

    const afterSnap = await cartsRef.get();

    await wrapped(afterSnap, { params: { id: "test" } });

    expect((await cartsRef.get()).exists).toBeFalsy();
  });
});
