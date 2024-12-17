import { Image } from "./Image";
import { Ingredient } from "./Ingredient";
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
  steps: recipeSteps[] | null;
  ingredients: Ingredient[] | null;
}
export interface recipeSteps {
  description: string;
}
export interface IngredientXQuantity {
  ingredient: Ingredient;
  quantity:number;
}
export interface MproductXRecipe {
  manufacturedProduct: ManufacturedProduct;
  recipe: Recipe;
  image: Image;
  file: File | null;
}

