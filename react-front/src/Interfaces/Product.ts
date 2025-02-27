import { Price } from "./Price";
import { Stock } from "./Stock";

export interface Product {
  id: number;
  denomination: string;
  description: string;
  availability: boolean;
  productCategoryID: number;
  price: Price;
  quantity?: number;
  routImage?: string | null;
  categoryDenomination?: string;
}

export interface ProductXStock {
  product: Product;
  stock: Stock;
  file?: File | null,
}
