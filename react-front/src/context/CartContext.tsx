
import React, { useContext, createContext, ReactNode, useReducer } from 'react';
import { cartReducer, initialState, CART_ACTION_TYPES } from '../reducers/cartReducer';
import { OrderDetail } from '../Interfaces/OrderDetail';
import { Product } from '../Interfaces/Product';
import { ManufacturedProduct } from '../Interfaces/ManufacturedProduct';


type CartContextProps = {
    cart: OrderDetail[];
    setCart: (cart: OrderDetail[]) => void;
    // ingredientQuantities: { [ingredientId: number]: number };
    addToCart: (item: Product | ManufacturedProduct) => void;
    removeFromCart: (item: Product | ManufacturedProduct) => void;
    //updateQuantity: (itemId: number, quantity: number) => void;
    decreaseCartQuantity: (item: Product | ManufacturedProduct) => void;
    clearCart: () => void;
};

// Crear el contexto del carrito
export const CartContext = createContext<CartContextProps | undefined>(undefined);

// Hook personalizado para usar el contexto del carrito
export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
function useCartReducer() {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const addToCart = (product: Product | ManufacturedProduct) => dispatch({ type: CART_ACTION_TYPES.ADD_TO_CART, payload: product });
    const removeFromCart = (product: Product | ManufacturedProduct) => dispatch({ type: CART_ACTION_TYPES.REMOVE_FROM_CART, payload: product })
    const clearCart = () => dispatch({ type: CART_ACTION_TYPES.CLEAR_CART });
    const setCart = (cart: OrderDetail[]) => dispatch({ type: CART_ACTION_TYPES.SET_CART, newState: cart })
    const decreaseCartQuantity = (product: Product | ManufacturedProduct) => dispatch({ type: CART_ACTION_TYPES.DECREASE_CART_QUANTITY, payload: product });
    return { state, addToCart, removeFromCart, clearCart, decreaseCartQuantity, setCart };
}
// Proveedor del contexto del carrito
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { state, addToCart, removeFromCart, clearCart, decreaseCartQuantity, setCart } = useCartReducer();
    console.log(JSON.stringify(state, null, 2));

    return (
        <CartContext.Provider value={{ cart: state, setCart, addToCart, removeFromCart, clearCart, decreaseCartQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
