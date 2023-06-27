// Importaciones de dependencias
import { useParams } from "react-router-dom";

// Importaciones de componenetes, funciones y modelos
import ProductDetailsCard from "./ProductDetailsCard/ProductDetailsCard";
import CarouselMultiItems from "./CarouselMultiItems/CarouselMultiItems";

// Importaciones de estilos
import "./ProductDetails.css";

// temporal hasta aplicar apis al componente
interface Product {
  id: number;
  image: string;
  title: string;
  link: string;
  category_id: string;
}

/**
 * Propiedades del componente ProductDetails. (temporales ya que hay que hay que desarrollar query para los productos relacionados)
 * @prop {Product[]} products - Un array de objetos Product para mostrar el carrusel de productos relacionados.
 */
interface ProductDetailsProps {
  products: Product[];
}

// explicacion del componente
const ProductDetails: React.FC<ProductDetailsProps> = ({ products }) => {
  const { productId } = useParams<{ productId: string }>();

  if (!productId || isNaN(parseInt(productId))) {
    return <div>No se encontró el producto</div>;
  }

  const parsedProductId = parseInt(productId);

  const product = products.find((p) => p.id === parsedProductId);

  if (!product) {
    return <div>No se encontró el producto</div>;
  }

  // Renderizado del componente
  return (
    <div className="product-details-page">
      <ProductDetailsCard product={product} />

      <h2 className="related-productos-title">Productos relacionados</h2>
      
      <CarouselMultiItems items={products} itemsPerSlide={5}/>
    </div>
  );
};

export default ProductDetails;
