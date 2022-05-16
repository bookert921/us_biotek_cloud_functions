import { LineItem, Product } from "../models";

export const provideLineItemsMetadata = (
  lineItems: LineItem[],
  subTypes = false
): string => {
  const table: {
    [item: string]: { price: number; quantity: number; subType?: string };
  } = {};

  lineItems?.forEach((item: any) => {
    const { product, quantity }: LineItem = item;

    if (
      product != undefined &&
      product.title != undefined &&
      product.price != undefined
    ) {
      if (!table[product.title]) {
        if (subTypes) {
          const { subType, subTypeSelected }: Product = product;
          if (subType != undefined && subTypeSelected != undefined) {
            table[product.title] = {
              price: product.price,
              quantity,
              subType: subType[subTypeSelected - 1]?.name,
            };
          } else {
            table[product.title] = { price: product.price, quantity };
          }
        } else {
          table[product.title] = { price: product.price, quantity };
        }
      }
    }
  });

  const container = [];
  for (const key in table) {
    if (key) {
      container.push(
        `${key}${
          subTypes && table[key].subType != undefined
            ? `(${table[key]?.subType})`
            : ""
        }: ${table[key].quantity} X $${table[key].price}`
      );
    }
  }
  const purchases = container.join(", ");

  return purchases;
};
