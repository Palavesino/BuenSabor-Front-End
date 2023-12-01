import { Ingredient } from "./Ingredient";

export interface ManufacturedProduct {
  id: number;
  denomination: string;
  description: string;
  availability: boolean;
  urlImage: string;
  productCategoryID: number;
  cookingTime: string;
}
export interface Recipe {
  id: number;
  denomination: string;
  description: string;
  step: string[];
}

export interface MproductXRecipe {
  manufacturedProduct: ManufacturedProduct;
  recipe: Recipe;
}
