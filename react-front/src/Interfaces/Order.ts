import { OrderStatus } from "../components/Enum/OrderStatus";
import { PaymentStatus } from "../components/Enum/Paid";
import { OrderDetail } from "./OrderDetail";

export interface Order {
    id: number
    address: string;
    apartment: string;
    discount: number;
    estimatedTime: string;
    paid: PaymentStatus;
    state: OrderStatus;
    isCanceled: boolean;
    phone: string;
    total: number;
    userId: number;
    userName: string;
    userLastName: string;
    deliveryMethod: string;
    paymentType: string;
    orderDetails: OrderDetail[];
}
export function initializeOrder() {
    return {
        id: 0,
        address: "",
        apartment: "",
        discount: 0,
        estimatedTime: "",
        paid: PaymentStatus.IN_PROCESS,
        state: false,
        isCanceled: false,
        phone: "",
        total: 0,
        userId: 0,
        userName: "",
        userLastName: "",
        deliveryMethod: "",
        orderDetails: [],
    }
}