// Importaciones de dependencias
import { useParams } from "react-router-dom";

// Importaciones de componenetes, funciones y modelos
import ProductDetailsCard from "./ProductDetailsCard/ProductDetailsCard";
import CarouselMultiItems from "./CarouselMultiItems/CarouselMultiItems";

// Importaciones de estilos
import "./ProductDetails.css";
import { ManufacturedProduct } from "../../../Interfaces/ManufacturedProduct";
import { useEffect, useState } from "react";
import { Product } from "../../../Interfaces/Product";
import { useGenericPublicGetXID } from "../../../Services/useGenericPublicGetXID";


/**
 * Propiedades del componente ProductDetails. (temporales ya que hay que hay que desarrollar query para los productos relacionados)
 * @prop {Product[]} products - Un array de objetos Product para mostrar el carrusel de productos relacionados.
 */

// explicacion del componente
const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const { type } = useParams<{ type: string }>();
  // Estado para almacenar las manufactured-products
  const [item, setItem] = useState<Product | ManufacturedProduct | null>(
    type === 'P' ? {} as Product : (type === 'M' ? {} as ManufacturedProduct : null)
  );

  const data = item !== null ? useGenericPublicGetXID<ManufacturedProduct | Product>(
    `${type === 'M' ? `/api/manufactured-products/sell` : type === 'P' ? `/api/products/sell` : ''}`,
    Number(productId), true
  ) : null;

  useEffect(() => {
    setItem(data);
  }, [data]);

  if (!productId || isNaN(parseInt(productId))) {
    return <div>No se encontró el producto</div>;
  }



  // Renderizado del componente
  return (
    <>
      {item !== null && (

        <div className="product-details-page">
          <ProductDetailsCard product={item} />

          {/* <h2 className="related-productos-title">Productos relacionados</h2> */}

          {/* <CarouselMultiItems items={Mproducts} itemsPerSlide={5} /> */}
        </div>
      )}
    </>
  );
};

export default ProductDetails;
