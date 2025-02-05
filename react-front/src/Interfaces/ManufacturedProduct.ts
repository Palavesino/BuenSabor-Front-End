import { Image } from "./Image";
import { Price } from "./Price";
import { Recipe } from "./Recipe";

export interface ManufacturedProduct {
  id: number;
  denomination: string;
  description: string;
  availability: boolean;
  manufacturedProductCategoryID: number;
  cookingTime: string;
  price: Price
  quantity?: number;
}
export interface MproductXRecipe {
  manufacturedProduct: ManufacturedProduct;
  recipe: Recipe;
  // image: Image;
  file: File | null;
}
