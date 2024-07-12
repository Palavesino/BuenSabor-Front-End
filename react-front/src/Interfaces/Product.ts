import { Price } from "./Price";

export interface Product {
  id: number;
  denomination: string;
  description: string;
  availability: boolean;
  minStock: number;
  actualStock: number;
  productCategoryID: number;
  price: Price;
  quantity?: number;
}
