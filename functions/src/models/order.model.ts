import Stripe from "stripe";
import { AcuitySchedule, ShoppingCart, User } from ".";

interface OldOrder {
  name: string;
  note: string;
  first_name: string;
  last_name: string;

  address1: string;
  address2: string;
  city: string;
  province: string;
  province_code: string;
  zip: string;
  country: string;
  shipping_required: boolean;
  shipping_address: {
    address1: string;
    address2: string;
    city: string;
    province: string;
    province_code: string;
    zip: string;
    country: string;
  };

  amount: number;
  tax: number;
  currency: string;
  status: string;

  line_items: any;
  gateway: string;
  fulfillment_status: string;
  financial_status: string;

  email: string;
  phone: string;
  updated_at: number;
  updated_by: string;
  created_by: string;
  created_at: number;
  browser_ip?: string;
  environment?: string;

  discounts: string;

  payment_details: {
    cc_bin: string;
    cc_company: string;
    cc_number: string;
    cvv_result_code: string;
  };

  uid: string;
  _id: string;
  cart: any;
  user: any;
  charge_response: any;
}

export interface Order
  extends Pick<
    OldOrder,
    | "cart"
    | "user"
    | "charge_response"
    | "created_at"
    | "status"
    | "updated_at"
    | "email"
    | "browser_ip"
  > {
  appointment: AcuitySchedule;
  cart: ShoppingCart;
  user: User;
  charge_response: string | Stripe.Response<Stripe.Charge> | undefined;
}
