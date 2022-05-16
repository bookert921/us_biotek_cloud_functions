export interface StripePaymentInfo {
  amount: number;
  card_number: string;
  expiration: string | string[];
  cc_security_code: string;
  cc_name_on_card: string | undefined;
  address1: string | undefined;
  address2: string | undefined;
  city: string | undefined;
  province: string | undefined;
  zip: string | undefined;
}
