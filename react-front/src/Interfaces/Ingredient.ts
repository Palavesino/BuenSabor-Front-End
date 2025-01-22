import { Stock } from "./Stock";

export interface Ingredient {
  id: number;
  denomination: string;
  unit: string;
  availability: boolean;
  ingredientCategoryID: number;
}

export interface IngredientXStock {
  ingredient: Ingredient;
  stock: Stock
}