/* eslint-disable no-case-declarations */
import * as sgMail from "@sendgrid/mail";
import * as EventEmitter from "events";
import { ShoppingCart } from "../models";
import { provideLineItemsMetadata, wherePropertyExists } from "../utils";

const sgKey = process.env.SENDGRID_API_KEY || "";
sgMail.setApiKey(sgKey);

export const sendReceiptEmitter = new EventEmitter();

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
    from: process.env.SENDGRID_SENDER || "",
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
    sendReceiptEmitter.emit("succeeded", msg);
  }
}

sendReceiptEmitter.on("succeeded", (msg) =>
  sgMail.send(msg).catch((error) => {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  })
);