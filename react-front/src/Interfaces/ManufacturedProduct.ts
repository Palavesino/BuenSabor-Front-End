
export interface ManufacturedProduct {
  id: number;
  denomination: string;
  description: string;
  availability: boolean;
  urlImage: string;
  manufacturedProductCategoryID: number;
  cookingTime: string;
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
}
