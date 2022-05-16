export interface MedicalCheckout {
  first_name: string;
  last_name: string;
  customer_id: string;
  practitioner_name: string;
  prac_first_name: string;
  prac_last_nam: string;
  prac_email: string;
  prac_phone: string;
  company_name: string;

  npi: string;

  address1: string;
  address2: string;
  city: string;
  province: string;
  province_code: string;
  zip: string;
  country: string;
  shipping_required: boolean;

  amount: number;
  tax: number;
  currency: string;

  line_items: [];
  gateway: string;
  fulfillment_status: string;
  financial_status: string;
  complete_order_url: string;

  email: string;
  phone: string;
  updated_at: Date;
  updated_by: string;
  created_by: string;
  created_at: Date;
  browser_ip: string;
  environment: string;

  discounts: string;

  user_type: string;
  billing_shipping: true;
  prac_pay: string;
  delivery_time: string;
  terms_of_service: boolean;
  status: string;
}

export interface LabOrder {
  first_name: string;
  last_name: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  status: string;
  kit_number: string;
  passport_number: string;
  nationality: string;
  dob: string;
  gender: string;
  order_id: string;
  email: string;
  email_notification: boolean;
  text_notification: boolean;
  _id: string;
}
