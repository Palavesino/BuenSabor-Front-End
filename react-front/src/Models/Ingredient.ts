export interface Ingredient {
  id: number;
  denomination: string;
  unit: string;
  availability: boolean;
  minStock: number;
  actualStock: number;
  ingredientCategoryID: number;
}
