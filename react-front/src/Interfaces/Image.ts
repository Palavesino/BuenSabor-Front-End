
export interface Image {
    id: number;
    name: string;
    productId: number | null;
    manufacturedProductId: number | null;
    userId: number | null;
    base64: string;
}