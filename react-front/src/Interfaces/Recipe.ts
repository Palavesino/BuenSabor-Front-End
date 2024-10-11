import { IngredientXQuantity } from "./IngredienteXQuantity";
import { RecipeSteps } from "./RecipeSteps";

export interface Recipe {
    id: number;
    denomination: string;
    description: string;
    manufacturedProductId: number;
    steps: RecipeSteps[];
    ingredientsQuantity: IngredientXQuantity[];
  }
