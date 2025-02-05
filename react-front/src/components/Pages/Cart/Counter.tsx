import React from "react";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import "./Counter.css";
import { useCart } from "../../../context/CartContext";
import { Product } from "../../../Interfaces/Product";
import { ManufacturedProduct } from "../../../Interfaces/ManufacturedProduct";
interface CounterProps {
  width?: number;
  height?: number;
  quantity: number;
  // onUpdateQuantity: (quantity: number) => void;
  //onUpdateQuantity: (quantity: number) => void;
  // item: CartItem;
  item?: Product | ManufacturedProduct;
}
const Counter: React.FC<CounterProps> = ({ width, height, item, quantity }) => {
  const { addToCart, decreaseCartQuantity } = useCart();
  // const positiveCounter = () => {
  //   onUpdateQuantity(quantity + 1);
  // };
  // const negativeCounter = () => {
  //   if (quantity > 1) {
  //     onUpdateQuantity(quantity - 1);
  //   }
  // };

  return (
    <>
      <div
        className="div-counter"
        style={{
          width: `${width ? (width * 100) / 12 : ""}%`,
          height: `${height ? (height * 100) / 12 : ""}%`,
        }}
      >
        <button
          type="button"
          className="circle-Remove"
          onClick={() => {
            if (item) {
              decreaseCartQuantity(item);
            }
          }}
        >

          <IoMdRemove className="icon-Remove" />
        </button>
        <span className="counter">{quantity}</span>
        <button type="button" className="circle-Add"
          onClick={() => {
            if (item) {
              addToCart(item);
            }
          }}
        >
          <IoMdAdd className="icon-Add" />
        </button>
      </div>
    </>
  );
};

export default Counter;
