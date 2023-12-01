export interface Category {
  id: number;
  denomination: string;
  availability: boolean;
  type: string;
  categoryFatherId?: number;
  categoryFatherDenomination: string;
}
