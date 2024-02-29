// Importaciones de dependencias
import { useState } from "react";

// Importaciones de componenetes, funciones y modelos
import CategoryList from "./CategoryList/CategoryList";

// Importaciones de estilos
import "./Products.css";
import ProductCard from "./ProductCard/ProductCard";

interface Product {
  id: number;
  image: string;
  title: string;
  link: string;
  category_id: string;
}

interface Category {
  id: number;
  image: string;
  title: string;
}

interface ProductsProps {
  products: Product[];
  categories: Category[];
}

/*
 * Componente de productos
 * El componente muestra una página de productos con tarjetas de productos.
 * Utiliza el componente `CategoryList` para mostrar una lista de categorías de productos.
 * Cada producto se muestra en una tarjeta (`CCard`) con una imagen, título y un botón.
 */
const Products: React.FC<ProductsProps> = ({ products, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filteredProducts = selectedCategory
    ? products.filter(
        (product) => parseInt(product.category_id) === selectedCategory
      )
    : products;

  const handleCategoryClick = (categoryId: number) => {
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
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
