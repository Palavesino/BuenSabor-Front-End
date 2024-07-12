import { Image } from "./Image";
import { Price } from "./Price";

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
export interface Recipe {
  id: number;
  denomination: string;
  description: string;
  manufacturedProductId: number;
  steps: recipeSteps[];
}
export interface recipeSteps {
  description: string;
}

export interface MproductXRecipe {
  manufacturedProduct: ManufacturedProduct;
  recipe: Recipe;
  image: Image;
  file: File | null;
}
