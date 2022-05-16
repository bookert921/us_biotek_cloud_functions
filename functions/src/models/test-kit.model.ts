export interface TestKitOrder {
  customer_id?: string;
  order_id?: string;
  order?: any;
  pract_id?: string;
  order_date?: any;
  order_taker?: string;
  product_type_ordered?: string;
  requester?: string;
  company_name?: string;

  process?: string;
  loc_pos?: string;
  clinic_name?: string;
  req_loc?: string;

  shipping_method?: string;
  tracking_num?: string;

  processing_status?: string;
  processing_comment?: string;
  comment?: string;

  shopify_order_number?: string;
  kit_number?: string;

  time_collected?: any;
  date_collected?: any;

  gender?: string;
  dob?: string;
  age?: number;
  status: any;

  bill_method?: string;
  notch_name?: string;
  notch_order_id?: string;

  label_amount?: any;
  sample_type?: string;
  sample_volume?: string;

  files?: any;

  first_name?: string;
  last_name?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  zip?: string;
  country?: string;
  email: any;
  phone?: string;
  text_notification: boolean;
  email_notification: boolean;
  uid: any;
  _id: any;

  updated_at: number;
  updated_by: string;
  created_by: string;
  created_at: number;
  browser_ip?: string;
}
