import { ManufacturedProduct } from "../Interfaces/ManufacturedProduct";
import { OrderDetail } from "../Interfaces/OrderDetail";
import { Product } from "../Interfaces/Product";

export const initialState: OrderDetail[] = JSON.parse(window.localStorage.getItem('cart') || '[]');

interface CountActionProps {
    type: string;
    payload?: Product | ManufacturedProduct;
    newState?: OrderDetail[];
}

// Tipos de acciones del carrito
export const CART_ACTION_TYPES = {
    ADD_TO_CART: 'ADD_TO_CART',
    REMOVE_FROM_CART: 'REMOVE_FROM_CART',
    CLEAR_CART: 'CLEAR_CART',
    DECREASE_CART_QUANTITY: 'DECREASE_CART_QUANTITY',
    SET_CART: 'SET_CART',
} as const;
// update localStorage with state for cart
export const updateLocalStorage = (state: OrderDetail[]) => {
    window.localStorage.setItem('cart', JSON.stringify(state))
}

export const cartReducer = (state: OrderDetail[], action: CountActionProps): OrderDetail[] => {
    const { type: actionType, payload: actionPayload, newState } = action;
    const isProduct = (actionPayload && ('productCategoryID' in actionPayload));
    switch (actionType) {
        case CART_ACTION_TYPES.ADD_TO_CART: {
            if (actionPayload) {

                const productInCartIndex =
                    isProduct
                        ? state.findIndex(item => item.itemProduct?.id === actionPayload.id)
                        : state.findIndex(item => item.itemManufacturedProduct?.id === actionPayload.id);
                const newState = productInCartIndex >= 0 ? [
                    ...state.slice(0, productInCartIndex),
                    {
                        ...state[productInCartIndex],
                        quantity: state[productInCartIndex].quantity + 1,
                        subtotal: (state[productInCartIndex].quantity + 1) * actionPayload.price.sellPrice
                    },
                    ...state.slice(productInCartIndex + 1)
                ] : [
                    ...state,
                    {
                        id: 0,
                        quantity: 1,
                        subtotal: actionPayload.price.sellPrice,
                        ...(isProduct
                            ? { itemProduct: actionPayload as Product }
                            : { itemManufacturedProduct: actionPayload as ManufacturedProduct }
                        )
                    }
                ];
                updateLocalStorage(newState);
                return newState;
            }
            return state;
        }
        case CART_ACTION_TYPES.DECREASE_CART_QUANTITY: {
            if (actionPayload) {
                const productInCartIndex =
                    isProduct
                        ? state.findIndex(item => item.itemProduct?.id === actionPayload.id)
                        : state.findIndex(item => item.itemManufacturedProduct?.id === actionPayload.id);
                if (productInCartIndex >= 0) {
                    if (state[productInCartIndex].quantity > 1) {
                        const newState = [
                            ...state.slice(0, productInCartIndex),
                            {
                                ...state[productInCartIndex], quantity: state[productInCartIndex].quantity - 1,
                                subtotal: (state[productInCartIndex].quantity - 1) * actionPayload.price.sellPrice
                            },
                            ...state.slice(productInCartIndex + 1)
                        ]
                        updateLocalStorage(newState);
                        return newState;
                    }
                }
            }
            return state;
        }
        case CART_ACTION_TYPES.REMOVE_FROM_CART: {
            if (actionPayload) {
                const newState =
                    isProduct
                        ? state.filter(item => item.itemProduct?.id !== actionPayload.id)
                        : state.filter(item => item.itemManufacturedProduct?.id !== actionPayload.id);
                updateLocalStorage(newState)
                return newState;
            }
            return state;
        }
        case CART_ACTION_TYPES.CLEAR_CART: {
            updateLocalStorage([]);
            return [];
        }
        case CART_ACTION_TYPES.SET_CART: {
            if (newState) {
                updateLocalStorage(newState);
                return newState;
            }
            updateLocalStorage([]);
            return state;
        }
        default:
            return state;
    }
};