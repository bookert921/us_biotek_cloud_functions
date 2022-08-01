/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-case-declarations */
import * as sgMail from "@sendgrid/mail";
import { config } from "firebase-functions/v1";
import { ShoppingCart } from "../models";
import { provideLineItemsMetadata, wherePropertyExists } from "../utils";

const sgKey = config().sendgrid.key || "";
sgMail.setApiKey(sgKey);

/**
 * @param {ShoppingCart} cart
 * @param {string} status
 * @param {string} orderId
 */
export function sendOrderReceipt(
  cart: ShoppingCart,
  status: string,
  orderId: string
) {
  const msg: any = {
    from: process.env.SENDGRID_SENDER!,
    templateId: process.env.SENDGRID_TEMPLATE_ID,
    personalizations: [
      {
        to: [{ email: cart.email }],
        substitutions: {
          "%fname%": cart.payment_details?.cc_name_on_card || "Dear Customer",
          "%forderID%": orderId,
          "%faddress%": `${wherePropertyExists([
            cart.address1,
          ])} ${wherePropertyExists([cart.address2])} ${wherePropertyExists([
            cart.city,
          ])}, ${wherePropertyExists([cart.province])} ${wherePropertyExists([
            cart.zip,
          ])}`,
        },
      },
    ],
  };
  if (status === "succeeded") {
    const line_items = provideLineItemsMetadata(cart.line_items || [], true)
      .split(",")
      .join("\n");

    msg.personalizations[0].substitutions["%forderItems%"] = line_items;
    sgMail
      .send(msg)
      .then((data) => {
        console.log("sent: ", data);
      })
      .catch((error) => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
      });
  }
}
