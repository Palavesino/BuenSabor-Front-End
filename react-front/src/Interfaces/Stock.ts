export interface Stock {
    id: number;
    actualStock: number;
    minStock: number;
    productStockID: number | null;
    ingredientStockID: number | null;
    denomination: string;
}