// Importaciones de dependencias
import { useEffect, useState } from "react";

// Importaciones de componenetes, funciones y modelos

// Importaciones de estilos
import "./Products.css";
import ProductCard from "./ProductCard/ProductCard";
import { Category } from "../../../Interfaces/Category";
import { ItemList } from "../../../Interfaces/ItemList";
import { useGetItems } from "./hook/use-GetItems";
import { useGenericPublicGet } from "../../../Services/useGenericPublicGet";
import DropdownMenu from "./CategoryList/DropdownMenu";

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
  const [items, setItems] = useState<ItemList[]>([]);
  const getItems = useGetItems();
  const data = useGenericPublicGet<Category>(
    "/api/categories/public/filter/catalogue",
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

  const filteredProducts = selectedCategory
    ? isProduct
      ? items.filter((item) => item.categoryId === selectedCategory)
      : items.filter((item) => item.categoryId === selectedCategory)
    : items;

  const handleCategoryClick = (categoryId: number, isProduct: boolean) => {
    setIsProduct(isProduct);
    setSelectedCategory(categoryId);
  };
  return (
    <div className="products-page">
      <div className="categories-container">
        <DropdownMenu categories={categories} onCategoryClick={handleCategoryClick}/>
        {/* <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
        /> */}
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