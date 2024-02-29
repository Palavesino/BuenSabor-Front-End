// Importaciones de Dependemcias
import {
  CButton,
  CCard,
  CCardBody,
  CCardImage,
  CCardTitle,
} from "@coreui/react";
import { Link } from "react-router-dom";

// Importaciones de estilos
import "./ProductCard.css";

// temporal
interface Product {
  id: number;
  image: string;
  title: string;
  link: string;
  category_id: string;
}

/**
 * Propiedades del componente ProductCard.
 * @prop {Product} product - El objeto Product que representa un producto a mostrar.
 */
interface ProductCardProps {
  product: Product;
}

/*
 * Componente para mostrar un producto en forma de tarjeta.
 * Recibe la propiedad `product` que representa los datos del producto a mostrar.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

  // Renderizado del componente
  return (
    <CCard className="cui-product-card">
      <CCardImage orientation="top" src={product.image} />
      <CCardBody>
        <CCardTitle className="cui-product-card-body-tittle" style={{marginLeft: "-.1rem", fontSize: "1.3rem"}}>
          {product.title}
        </CCardTitle>
        <CButton className="cui-product-card-body-button" style={{backgroundColor: "rgb(17, 17, 17)", borderColor: "rgb(246, 189, 90)"}}>
          <Link
            to={`/productos/${product.id}`}
            className="cui-product-card-body-button-text"
            style={{color: "rgb(246, 189, 90)"}}
          >
            Detalles del producto
          </Link>
        </CButton>
      </CCardBody>
    </CCard>
  );
};

export default ProductCard;
