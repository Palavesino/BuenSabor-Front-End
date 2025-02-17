// Importaciones de dependencias
import { useEffect, useState } from 'react'

// Importaciones de componenetes, funciones y modelos
import CategoryList from './CategoryList/CategoryList'

// Importaciones de estilos
import './Products.css'
import ProductCard from './ProductCard/ProductCard'
import { Category } from '../../../Interfaces/Category'
import { ItemList } from '../../../Interfaces/ItemList'
import { useGetItems } from './hook/use-GetItems'
import { useGenericPublicGet } from '../../../Services/useGenericPublicGet'

/*
 * Componente de productos
 * El componente muestra una página de productos con tarjetas de productos.
 * Utiliza el componente `CategoryList` para mostrar una lista de categorías de productos.
 * Cada producto se muestra en una tarjeta (`CCard`) con una imagen, título y un botón.
 */

const Products = () => {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isProduct, setIsProduct] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<ItemList[]>([]); // Cambié esto a un arreglo de ItemList
  const [filteredProducts, setFilteredProducts] = useState<ItemList[]>([]); // También lo cambié aquí

  const getItems = useGetItems();
  const data = useGenericPublicGet<Category>(
    '/api/categories/public/filter/catalogue',
    'Categorías Product And Manufactured'
  );

  useEffect(() => {
    async function getProducts() {
      const fetchedItems = await getItems();
      if (fetchedItems) {
        setItems(fetchedItems); // Aquí estamos esperando un arreglo de ItemList
        setFilteredProducts(fetchedItems); // Mostrar todos los productos por defecto
      }
    }
    if (data && data.length > 0) {
      getProducts();
      setCategories(data);
    }
  }, [data]);

  const filteredProductsList = selectedCategory
    ? items.filter((item) => item.categoryId === selectedCategory) // Filtra por categoría
    : items; // Si no hay categoría seleccionada, muestra todos los productos

  const handleCategoryClick = (categoryId: number, isProduct: boolean) => {
    const hasChildren = categories.some((child) => child.categoryFatherId === categoryId);

    if (hasChildren) {
      // Si la categoría tiene hijos, expándela o ciérrala
      setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
      setSelectedCategory(null);
      setFilteredProducts([]); // Limpia la lista de productos al deseleccionar la categoría
    } else {
      setSelectedCategory(categoryId);
      setIsProduct(isProduct);
      setFilteredProducts([]); // Limpia productos previamente mostrados

      // Filtra productos según la categoría seleccionada
      const filtered = items.filter((item) => item.categoryId === categoryId);
      setFilteredProducts(filtered); // Actualizar los productos filtrados
    }
  };

  return (
    <div className="products-page">
      <div className="categories-container">
        <CategoryList
          categories={categories.filter((cat) => cat.categoryFatherId === null)}
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
        />

        {expandedCategory && (
          <CategoryList
            categories={categories.filter((cat) => cat.categoryFatherId === expandedCategory)}
            selectedCategory={selectedCategory}
            className="subcategory-list"
            onCategoryClick={handleCategoryClick}
          />
        )}
      </div>
      <div className="products-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              isProduct={isProduct} // Pasa isProduct como prop
            />
          ))
        ) : (
          <p>No products available for this category</p>
        )}
      </div>
    </div>
  );
};

export default Products;
