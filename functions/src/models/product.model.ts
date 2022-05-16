export interface Product {
  title?: string;
  quantity?: number;
  discontinued?: boolean;
  active?: boolean;
  images?: any;
  files?: any;
  description?: {
    short: string;
    long: string;
  };
  manufacturer?: string;
  author?: string;
  category?: string;
  lead_time?: number;
  product_type?: string;
  on_sale?: boolean;
  sale_price?: number;
  price?: number;
  calculatedPrice?: number;
  re_order_level?: number;
  sku?: string;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  units_on_order?: number;
  units_in_stock?: number;
  updated_at?: number;
  updated_by?: string;
  created_by?: string;
  created_at?: number;
  browser_ip?: string;
  keywords?: string;
  subType?: Array<any>;
  subTypeSelected?: any;
  subCategory?: Array<any>;
  dependency?: {
    price_dependent: boolean;
    dependency_code: string;
    price: number;
    sale_price: number;
    on_sale: boolean;
  };

  uid?: string;
  _id?: string;
}
