import { Product } from ".";

export interface ShoppingCart {
  first_name?: string;
  last_name?: string;
  customer_id?: string;
  user_type?: string;
  prac_pay?: string;
  practitioner_name?: string;
  prac_first_name?: string;
  prac_last_name?: string;
  prac_email?: string;
  prac_phone?: string;

  company_name?: string;

  npi?: string;

  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  province_code?: string;
  zip?: string;
  country?: string;
  shipping_required?: boolean;
  shipping_address?: {
    first_name?: string;
    last_name?: string;
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    province_code?: string;
    zip?: string;
    country?: string;
  };

  amount?: any;
  tax?: number;
  currency?: string;
  status?: string;

  line_items?: Array<LineItem>;
  gateway?: string;
  fulfillment_status?: string;
  financial_status?: string;
  complete_order_url?: string;

  email?: string;
  phone?: string;
  updated_at?: number;
  updated_by?: string;
  created_by?: string;
  created_at?: number;
  browser_ip?: string;
  environment?: string;

  discounts?: string;
  delivery_time?: string;

  payment_details?: PaymentDetails;

  uid?: string;
  _id?: string;
}

export interface LineItem {
  product: Product;
  quantity: number;
}

export interface PaymentDetails {
  cc_bin?: string;
  cc_company?: string;
  cc_name_on_card?: string;
  cc_number: string;
  cc_exp_date: string;
  cc_security_code: string;
}
