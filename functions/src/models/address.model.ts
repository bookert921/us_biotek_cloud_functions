export interface Address {
  address1: string;
  address2: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  county: string;
  address_type: string;
  latitude: number;
  longitude: number;
  updated_at: number;
  updated_by: string;
  created_by: string;
  created_at: number;
  browser_ip?: string;

  uid: string;
  _id: string;
}
