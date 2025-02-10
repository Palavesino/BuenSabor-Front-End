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
import { ManufacturedProduct } from "../../../../Interfaces/ManufacturedProduct";
import { Product } from "../../../../Interfaces/Product";
import { useEffect, useState } from "react";
import { Image } from "../../../../Interfaces/Image";
import { useGetImageId } from "../../../../Util/useGetImageId";
/**
 * Propiedades del componente ProductCard.
 * @prop {Product} product - El objeto Product que representa un producto a mostrar.
 */
interface ProductCardProps {
  product: Product | ManufacturedProduct;
  isProduct: boolean;
}

/*
 * Componente para mostrar un producto en forma de tarjeta.
 * Recibe la propiedad `product` que representa los datos del producto a mostrar.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, isProduct }) => {
  const [image, setImage] = useState<Image>()
  const getImage = useGetImageId();
  const rut = isProduct ? "../../../../../uploads/products/"
    : "../../../../../uploads/manufactured_products/"
  useEffect(() => {
    const fetchImage = async () => {
      if (product) {
        const imageData = await getImage(product.id, (isProduct ? 'P' : 'M'));
        setImage(imageData);
      }
    };
    fetchImage();
  }, []);
  // const validate = useValidate();
  //   useEffect(() => {
  //     const fetchData = async () => {
  //         try {
  //          await validate(product.id, isProduct ? 'P' : 'M'); // Valida la disponibilidad del producto
  //         } catch (error) {
  //           console.error("Error al verificar el producto:", error);
  //         }
  //     };

  //     fetchData(); // Llama a la validación al cargar el componente
  //   }, []);

  // Renderizado del componente
  return (
    <CCard className="cui-product-card">
      {
        image ? (<CCardImage orientation="top" src={`${rut}${image.name}`} />)
          : <CCardImage orientation="top" src="https://www.clarin.com/img/2022/11/25/tR-l3EmRl_2000x1500__1.jpg" />
      }

      <CCardBody>
        <CCardTitle className="cui-product-card-body-tittle" style={{ marginLeft: "-.1rem", fontSize: "1.3rem" }}>
          {product.denomination}
        </CCardTitle>
        <CButton className="cui-product-card-body-button" style={{ backgroundColor: "rgb(17, 17, 17)", borderColor: "rgb(246, 189, 90)" }}>
          <Link
            to={`/productos/${isProduct ? 'P' : 'M'}/${product.id}`}
            className="cui-product-card-body-button-text"
            style={{ color: "rgb(246, 189, 90)" }}
          >
            Detalles del producto
          </Link>
        </CButton>
      </CCardBody>
    </CCard>
  );
};

export default ProductCard;
