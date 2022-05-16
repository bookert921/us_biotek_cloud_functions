import { firestore, logger } from "firebase-functions";
import { store } from "..";
import { Order, ShoppingCart } from "../../../models";
import {
  connectStripeThroughFirestore,
  processPaymentWithStripe,
} from "../../../services";

/**
 * When cart is submit status, the stripe account secret is looked up
 * and used to process the payment of cart items.
 *
 * Once processed, the cart is transferred to orders with additional data:
 * {
 *  appointment: AcuitySchedule;
 *  cart: ShoppingCart;
 *  user: User;
 *  charge_response: string | Stripe.Response<Stripe.Charge> | undefined;
 *  updated_at: Date;
 *  created_at: Date;
 *  status: string;
 * }
 * After which, the cart is removed from database.
 */
export const onCartCreate = firestore
  .document("/carts/{id}")
  .onCreate(async (snapshot, context) => {
    const cart: ShoppingCart = snapshot.data();
    const cartID: string = context.params.id;

    if (cart.status === "Submitted") {
      try {
        /* Make Payment With Stripe */
        const { charge, status } = await store
          .collection("settings")
          .get()
          .then(connectStripeThroughFirestore)
          .then((stripe) => processPaymentWithStripe(stripe, cart));

        /* Update Cart Details */
        logger.info(`Now updating cart: ${cartID}.`);
        await snapshot.ref
          .update({
            "payment_details.cc_security_code": "",
          })
          .then((writeResult) => {
            logger.info(
              `Cart: ${cartID} has been prepped for order at ${writeResult.writeTime.toDate()}.`
            );
          });

        /* Create Order From Cart With Payment Info */
        logger.log(`Creating new Order object under: ${cartID}.`);
        await snapshot.ref.get().then(async (doc) => {
          const updatedCart = doc.data();
          if (!updatedCart) throw new Error("Updated cart not found!");
          const data: Partial<Order> = {
            charge_response: charge,
            cart: updatedCart,
            status: status,
            created_at: doc.updateTime?.nanoseconds,
          };

          return await store
            .collection("orders")
            .doc(cartID)
            .create(data)
            .then((val) => {
              return val.writeTime.toDate();
            });
        });

        /* Remove Current Cart */
        logger.info(`Now deleting cart: ${cartID}...`);
        return await store
          .collection("carts")
          .doc(cartID)
          .delete()
          .then((writeResult) => {
            logger.info(
              `Cart: ${cartID} removed at writeTime: ${writeResult.writeTime.toDate()}.`
            );
          });
      } catch (err) {
        logger.error(err);
      }
    }
    return null;
  });
