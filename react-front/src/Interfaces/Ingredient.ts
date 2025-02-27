import { Stock } from "./Stock";

export interface Ingredient {
  id: number;
  denomination: string;
  unit: string;
  availability: boolean;
  ingredientCategoryID: number;
  categoryDenomination?: string;
}

export interface IngredientXStock {
  ingredient: Ingredient;
  stock: Stock
}