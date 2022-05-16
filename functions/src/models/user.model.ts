export interface User {
  customer_id?: string;
  status?: string;
  email?: string;
  company_name?: string;
  display_name?: string;
  first_name: string;
  middle_name?: string;
  last_name?: string;
  phone_number?: string;
  photo_url?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  province_code?: string;
  zip?: string;
  country?: string;
  gender?: string;
  dob?: string;
  activation?: any;
  user_type?: string;
  date_collected?: any;
  time_collected?: any;

  kit_number?: string;
  passport_number?: string;
  nationality?: string;
  ssn?: string;
  license?: {
    imageURL: ImageURL[];
  };
  insurance_card?: {
    imageURL: ImageURL[];
  };

  has_insurance?: boolean;
  insurance_name?: string;
  insurance_policy_number?: string;
  insurance_group_number?: string;
  insurance_suffix_number?: string;

  practitioner_name?: string;
  prac_first_name?: string;
  prac_last_name?: string;
  npi?: string;
  patient_practioner?: any;

  cc_company?: string;
  cc_name_on_card?: string;
  cc_number?: string;
  cc_exp_date?: string;

  cart?: any;

  images?: any;
  files?: any;
  groups?: Array<any>;
  roles?: Roles;
  vaccinated?: boolean;

  updated_at?: number;
  updated_by?: string;
  created_by?: string;
  created_at?: number;
  browser_ip?: string;
  uid?: any;
  _id?: any;
}

interface Roles {
  reader: boolean;
  author?: boolean;
  admin?: boolean;
}

type ImageURL = {
  name: string;
  uploaded_at: number;
  url: string;
};

// interface Company {
//   company_name?: string;
//   address1?: string;
//   address2?: string;
//   city?: string;
//   province?: string;
//   province_code?: string;
//   zip?: string;
//   country?: string;

//   cc_company?: string;
//   cc_name_on_card?: string;
//   cc_number?: string;
//   cc_exp_date?: string;

//   updated_at?: number;
//   updated_by?: string;
//   created_by?: string;
//   created_at?: number;
//   browser_ip?: string;
//   uid?: any;
//   _id?: any;
// }
