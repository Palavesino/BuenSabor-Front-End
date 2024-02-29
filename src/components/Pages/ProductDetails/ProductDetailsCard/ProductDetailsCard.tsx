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

// Esto es temporal hasta que se apliquen las apis al componente con la BD
interface Product {
  id: number;
  image: string;
  title: string;
  link: string;
  category_id: string;
}

/**
 * Propiedades del componente ProductDetailsCard.
 * @prop {Product} product - Objeto Product que representara los detalles del producto.
 */
interface ProductDetailsCardProps {
  product: Product;
}

// eplicacion del componente
const ProductDetailsCard: React.FC<ProductDetailsCardProps> = ({ product }) => {
  
  // Renderizado del componente
  return (
    <CCard
      className="card-product-details"
      style={{ backgroundColor: "transparent", border: "none" }}
    >
      <CRow className="g-0">
        <CCol md={5}>
          <CCardImage src={product.image} />
        </CCol>

        <CCol md={7}>
          <CCardBody>
            <CCardTitle className="card-title">{product.title}</CCardTitle>
            <CCardText className="card-description">{"prueba de descripcion"}</CCardText>
            <CButton
              style={{
                borderColor: "#F6BD5A",
                color: "#F6BD5A",
                boxShadow: "inset 11px 20px 9px -20px rgba(255, 201, 0, 0.4)",
                background: "#111",
                borderRadius: "2rem",
              }}
              className="card-button"
              href="#"
            >
              {"Agregar al carrito"}
            </CButton>
            <CCardText className="card-price">{"1312$"}</CCardText>
          </CCardBody>
        </CCol>
      </CRow>
    </CCard>
  );
};

export default ProductDetailsCard;
