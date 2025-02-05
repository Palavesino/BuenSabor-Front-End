import { ManufacturedProduct } from "./ManufacturedProduct";
import { Product } from "./Product";

export interface OrderDetail {
    id: number;
    quantity: number;
    subtotal: number;
    itemProduct?: Product;
    itemManufacturedProduct?: ManufacturedProduct;
}