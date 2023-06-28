export interface Category {
  id: number;
  denomination: string;
  availability: boolean;
  type: boolean;
  categoryFatherId?: number;
  categoryFatherDenomination: string;
}
