
export interface Image {
    id: number;
    name: string;
    route: string;
    type: string;
    size: number;
    productId: number | null;
    manufacturedProductId: number | null;
    userId: number | null;
    base64: string;
}