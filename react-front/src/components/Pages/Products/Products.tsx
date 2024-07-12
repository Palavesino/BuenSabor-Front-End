// Importaciones de dependencias
import { useEffect, useState } from "react";

// Importaciones de componenetes, funciones y modelos
import CategoryList from "./CategoryList/CategoryList";

// Importaciones de estilos
import "./Products.css";
import ProductCard from "./ProductCard/ProductCard";
import { Category } from "../../../Interfaces/Category";
import { ItemList } from "../../../Interfaces/ItemList";
import { useGetItems } from "./hook/use-GetItems";
import { useGenericGet } from "../../../Services/useGenericGet";

/*
 * Componente de productos
 * El componente muestra una página de productos con tarjetas de productos.
 * Utiliza el componente `CategoryList` para mostrar una lista de categorías de productos.
 * Cada producto se muestra en una tarjeta (`CCard`) con una imagen, título y un botón.
 */
const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isProduct, setIsProduct] = useState(false);
  // Estado para almacenar los productos
  const [categories, setCategorys] = useState<Category[]>([]);
  // Estado para almacenar las manufactured-products
  const [items, setItems] = useState<ItemList>({ productDTOList: [], manufacturedProductDTOList: [] });
  const getItems = useGetItems();
  const data = useGenericGet<Category>(
    "/api/categories/filter/catalogue",
    "Categorías Product And Manufactured",

  );
  useEffect(() => {
    async function getProducts() {
      const fetchedItems = await getItems();
      if (fetchedItems) {
        setItems(fetchedItems);
      }
    }
    // Actualizar las categorías cuando se obtiene nueva data
    if (data && data.length > 0) {
      getProducts();
      setCategorys(data);
    }
  }, [data]);

  const filteredProducts = selectedCategory ? (
    isProduct
      ? (items.productDTOList || []).filter((item) => item.productCategoryID === selectedCategory)
      : (items.manufacturedProductDTOList || []).filter((item) => item.manufacturedProductCategoryID === selectedCategory)
  ) : (
    isProduct ? items.productDTOList || [] : items.manufacturedProductDTOList || []
  );


  const handleCategoryClick = (categoryId: number, isProduct: boolean) => {
    setIsProduct(isProduct);
    setSelectedCategory(categoryId);
  };
  return (
    <div className="products-page">
      <div className="categories-container">
        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
        />
      </div>
      <div className="products-container">
        {filteredProducts && filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} isProduct={isProduct} />
        ))}

      </div>
    </div>
  );
};

export default Products;
