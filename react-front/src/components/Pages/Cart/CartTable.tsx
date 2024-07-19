import { Table, Image, Button } from "react-bootstrap"
import "./cartTable.css";
import Counter from "./Counter";
import { RxCross2 } from "react-icons/rx";
import { useCart } from "../../../context/CartContext";
import { BsCartXFill, BsCartCheckFill } from "react-icons/bs";
import { useState } from "react";
import OrderForm from "../../Order/OrderForm";
import { usePermission } from "../../../context/PermissionContext";
import { UserRole } from "../../Enum/UserRole";

const CartTable = () => {
    const { permission } = usePermission();
    const { cart, removeFromCart, clearCart } = useCart();
    const total = cart.reduce((acc, item) => acc + item.subtotal, 0);
    const [showModal, setShowModal] = useState(false);
    const handleClick = () => {
        if (permission !== UserRole.espectador) {
            setShowModal(true);
        } else {
            alert("Necesitas Estar Logeada Para Poder comprar");
        }
    };

    return (
        <>
            <Table responsive className='cart-Table'>
                <tbody>
                    {cart.map((product, index) => (
                        <tr key={index}>
                            <th className="image-header">
                                <Image className="image-table" src="https://www.clarin.com/img/2022/11/25/tR-l3EmRl_2000x1500__1.jpg" thumbnail />
                            </th>
                            <th className="name">
                                {product.itemProduct ? product.itemProduct.denomination : product.itemManufacturedProduct?.denomination}
                            </th>
                            <th className="counter">

                                <Counter
                                    width={15}
                                    quantity={product.quantity || 1}
                                    item={product.itemProduct || product.itemManufacturedProduct}
                                />
                            </th>
                            <th className="price">
                                {`$${product.itemProduct ? product.itemProduct.price.sellPrice : product.itemManufacturedProduct?.price.sellPrice}`}
                            </th>
                            <th className="remove">
                                <button
                                    type="button"
                                    className="circle-Remove-th"
                                    onClick={() => {
                                        if (product.itemProduct) {
                                            removeFromCart(product.itemProduct);
                                        } else if (product.itemManufacturedProduct) {
                                            removeFromCart(product.itemManufacturedProduct);
                                        }
                                    }}
                                >
                                    <RxCross2 className="image-remove" />
                                </button>
                            </th>
                        </tr>
                    ))}
                    {cart.length > 0 ? (
                        <tr>
                            <th className="clear"><BsCartXFill onClick={() => clearCart()} className="shopping-clear-cart-icon" /></th>
                            <th colSpan={2} className="total">Total</th>
                            <th colSpan={2} className="price-total">{`$${total}`}</th>
                        </tr>

                    ) : (
                        <tr>
                            <th colSpan={5} className="empty-cart-message">
                                <Button href="/productos" className="button-addProduct">
                                    Agregue un Producto al Carrito ⮕
                                </Button>
                            </th>
                        </tr>
                    )}
                </tbody>
            </Table>
            {cart.length > 0 && (
                <div className="div-button-buyProduct">
                    <Button className="button-buyProduct" onClick={handleClick} >
                        Comprar Productos <BsCartCheckFill className="shopping-buy-cart-icon" />
                    </Button>
                </div>
            )}

            {showModal && (
                <OrderForm show={showModal} setShowModal={setShowModal} />
            )}
        </>
    );
}

export default CartTable;
