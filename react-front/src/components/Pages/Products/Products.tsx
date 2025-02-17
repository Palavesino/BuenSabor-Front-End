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
import { Product } from '../../../Interfaces/Product'
import { ManufacturedProduct } from '../../../Interfaces/ManufacturedProduct'

/*
 * Componente de productos
 * El componente muestra una página de productos con tarjetas de productos.
 * Utiliza el componente `CategoryList` para mostrar una lista de categorías de productos.
 * Cada producto se muestra en una tarjeta (`CCard`) con una imagen, título y un botón.
 */
type CombinedProduct = Product | ManufacturedProduct;
const Products = () => {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [isProduct, setIsProduct] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<ItemList>({productDTOList: [],manufacturedProductDTOList: [],})
  const [filteredProducts, setFilteredProducts] = useState<CombinedProduct[]>([])

  const getItems = useGetItems()
  const data = useGenericPublicGet<Category>(
    '/api/categories/public/filter/catalogue',
    'Categorías Product And Manufactured'
  )

  useEffect(() => {
    async function getProducts() {
      const fetchedItems = await getItems()
      if (fetchedItems) {
        setItems(fetchedItems)
        setFilteredProducts([...fetchedItems.productDTOList,...fetchedItems.manufacturedProductDTOList,]) // Mostrar todos los productos por defecto
      }
    }
    if (data && data.length > 0) {
      getProducts()
      setCategories(data)
    }
  }, [data])

  const handleCategoryClick = (categoryId: number, isProduct: boolean) => {
    const hasChildren = categories.some((child) => child.categoryFatherId === categoryId)

    if (hasChildren) {
      // Si la categoría tiene hijos, expándela o ciérrala
      setExpandedCategory((prev) => (prev === categoryId ? null : categoryId))
      setSelectedCategory(null)
      setFilteredProducts([]) // Limpia la lista de productos al deseleccionar la categoría
    } else {
      setSelectedCategory(categoryId)
      setIsProduct(isProduct)
      setFilteredProducts([]) // Limpia productos previamente mostrados

      // Filtra productos según la categoría seleccionada
      const filtered = isProduct ? items.productDTOList.filter((item) => item.productCategoryID === categoryId)
      : items.manufacturedProductDTOList.filter((item) => item.manufacturedProductCategoryID === categoryId)

      setFilteredProducts(filtered) // Actualizar los productos filtrados
    }
  }

  return (
    <div className="products-page">
      <div className="categories-container">
        <CategoryList categories={categories.filter((cat) => cat.categoryFatherId === null)} selectedCategory={selectedCategory} onCategoryClick={handleCategoryClick}/>

        {expandedCategory && (
          <CategoryList categories={categories.filter((cat) => cat.categoryFatherId === expandedCategory)} selectedCategory={selectedCategory} className="subcategory-list" onCategoryClick={handleCategoryClick}/>)}
      </div>
      <div className="products-container">
        {filteredProducts.length > 0 ? (filteredProducts.map((product) => (<ProductCard key={product.id} product={product} isProduct={isProduct} />))) 
          : (<p>No products available for this category</p>)}
      </div>
    </div>
  )
}

export default Products
