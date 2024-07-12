import { ManufacturedProduct } from "./ManufacturedProduct";
import { Product } from "./Product";

export interface ItemList {
    productDTOList: Product[];
    manufacturedProductDTOList: ManufacturedProduct[];
}