// Importaciones de dependencias
import {
  CButton,
  CCard,
  CCardBody,
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
} from "@coreui/react";

// Importaciones de estilos
import "./ProductDetailsCard.css";
import { ManufacturedProduct } from "../../../../Interfaces/ManufacturedProduct";
import { useEffect, useState } from "react";
import { CartItem } from "../../../../Interfaces/CartItem";
import { useCart } from "../../../../context/CartContext";
import { Product } from "../../../../Interfaces/Product";
import { Image } from "../../../../Interfaces/Image";

// Esto es temporal hasta que se apliquen las apis al componente con la BD


/**
 * Propiedades del componente ProductDetailsCard.
 * @prop {Product} product - Objeto Product que representara los detalles del producto.
 */
interface ProductDetailsCardProps {
  product: Product | ManufacturedProduct | null;
  image: Image | null;
  isProduct: boolean;
}

// eplicacion del componente
const ProductDetailsCard: React.FC<ProductDetailsCardProps> = ({ product, image, isProduct }) => {
  const { cart, addToCart, removeFromCart } = useCart();
  const [insideCart, SetInsideCart] = useState(false);
  const rut = isProduct ? "../../../../../uploads/products/"
    : "../../../../../uploads/manufactured_products/"
  // const itemCart: CartItem | null = product ? {
  //   id: product.id,
  //   idCategory: 'manufacturedProductCategoryID' in product ? product.manufacturedProductCategoryID : product.productCategoryID,
  //   denomination: product.denomination,
  //   descuento: 0,
  //   price: product.price?.sellPrice || 0,
  //   quantity: 0,
  //   cookingTime: 'cookingTime' in product ? product.cookingTime : '00:00:00',
  // } : null;

  // Verificar si el producto es null o undefined
  if (!product) {
    return <div>No hay información del producto disponible.</div>;
  }
  // Obtener productos almacenados en localStorage
  // const storedProductsString = localStorage.getItem('productos');
  // const storedProducts: ManufacturedProduct[] = storedProductsString ? JSON.parse(storedProductsString) : [];
  useEffect(() => {
    const checkProductInCart = () => {
      return 'productCategoryID' in product
        ? cart.some(item => (item.itemProduct?.id === product.id))
        : cart.some(item => (item.itemManufacturedProduct?.id === product.id))
    }
    SetInsideCart(checkProductInCart);
  }, [product.id]);

  const handleOnClick = () => {
    if (product) {
      if (insideCart) {
        // Quitar producto del carrito
        // const updatedProducts = storedProducts.filter(p => p.id !== product.id);
        // localStorage.setItem('productos', JSON.stringify(updatedProducts));
        removeFromCart(product);
        SetInsideCart(false);
      } else {
        // Agregar producto al carrito
        // storedProducts.push(product);
        // localStorage.setItem('productos', JSON.stringify(storedProducts));
        addToCart(product);
        SetInsideCart(true);
      }
    }
  };
  // Renderizado del componente
  return (
    <CCard
      className="card-product-details"
      style={{ backgroundColor: "transparent", border: "none" }}
    >
      <CRow className="g-0">
        <CCol md={5}>
          {
            image ? (<CCardImage orientation="top" src={`${rut}${image.name}`} />)
              : <CCardImage orientation="top" src="https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500" />
          } </CCol>

        <CCol md={7}>
          <CCardBody>
            <CCardTitle className="card-title">{product.denomination}</CCardTitle>
            <CCardText className="card-description">{product.description}</CCardText>
            <CButton
              onClick={handleOnClick}
              disabled={!product.availability}
              style={{
                borderColor: "#F6BD5A",
                color: "#F6BD5A",
                boxShadow: "inset 11px 20px 9px -20px rgba(255, 201, 0, 0.4)",
                background: "#111",
                borderRadius: "2rem",
              }}
              className="card-button"
            >
              {!product.availability ? 'No Hay Stock' : (insideCart ? "Quitar del Carrito" : "Agregar al carrito")}
            </CButton>
            <CCardText className="card-price">{`$${product.price?.sellPrice}`}</CCardText>
          </CCardBody>
        </CCol>
      </CRow>
    </CCard>
  );
};

export default ProductDetailsCard;
