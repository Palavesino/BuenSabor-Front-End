// Importaciones de dependencias
import { CListGroup, CListGroupItem } from "@coreui/react";

// Importaciones de Assets
import image from "../../../../assets/images/868BD45E.jpeg";

// Importaciones de estilos
import "./CategoryList.css";

// temporal
interface Category {
  id: number;
  image: string;
  title: string;
}

/**
 * Propiedades del componente CategoryList.
 * @prop {Category[]} categories - Un array de objetos Category que representa las categorías.
 * @prop {number | null} selectedCategory - El ID de la categoría seleccionada, o null si no hay ninguna seleccionada.
 * @prop {(categoryId: number) => void} onCategoryClick - Función que se ejecuta cuando se hace clic en una categoría (recibe el ID de la categoría como argumento).
 */
interface CategoryListProps {
  categories: Category[];
  selectedCategory: number | null;
  onCategoryClick: (categoryId: number) => void;
}

/*
 * Componente de lista de categorías
 * El componente muestra una lista de categorías.
 * Cada categoría está representada por un elemento de lista y un ícono.
 * Utiliza el componente `CListGroup` de la biblioteca de diseño `CUI` para la estructura de la lista.
 * Las categorías se representan como elementos de lista con imágenes y texto.
 */
const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onCategoryClick,
}) => {

  // Renderizado del componente
  return (
    <CListGroup className="cui-list-group">
      {categories.map((category) => (
        <CListGroupItem
          key={category.id}
          component="button"
          className={`cui-list-group-item ${
            category.id === selectedCategory ? "active" : ""
          }`}
          onClick={() => onCategoryClick(category.id)}
        >
          <img src={image} alt={`image${category.id}`} />{" "}
          {/* src={category.image} */}
          {category.title}
        </CListGroupItem>
      ))}
    </CListGroup>
  );
};

export default CategoryList;
