import React, { useState } from 'react';
import './DropdownMenu.css'; // Importa el archivo CSS
import { Category } from '../../../../Interfaces/Category';

interface DropdownMenuProps {
    categories: Category[];
    onCategoryClick: (categoryId: number, isProduct: boolean) => void;
    //   selectedCategory: number | null;
    //   className?: string;
    //   onCategoryClick: (categoryId: number, isProduct: boolean) => void;
    //setSelectedCategory: React.Dispatch<React.SetStateAction<number | null>>
}


const DropdownMenu: React.FC<DropdownMenuProps> = ({ categories, onCategoryClick }) => {
    const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);
  
    const handleCategoryClick = (categoryId: number) => {
      setOpenCategoryId((prev) => (prev === categoryId ? null : categoryId));
    };
  
    return (
        <>
        {categories
          .filter((cat) => cat.categoryFatherId === null)
          .map((category) => (
            <div key={category.id} className="dropdown-item">
              <span
                className="category-label"
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.denomination}
              </span>
              {openCategoryId === category.id && (
                <div className="submenu">
                  {categories
                    .filter((cat) => cat.categoryFatherId === category.id)
                    .map((subCategory) => (
                      <div key={subCategory.id} className="submenu-item">
                        <span
                          className="subcategory-label"
                          onClick={() => onCategoryClick(subCategory.id, subCategory.type === "P")}
                        >
                          {subCategory.denomination}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </>
    );
  };
  
  export default DropdownMenu;



  /**  Recursiva para ver subsubMenus
   const CategoryItem: React.FC<{
    category: Category;
    categories: Category[];
    onCategoryClick: (categoryId: number, isProduct: boolean) => void;
}> = ({ category, categories, onCategoryClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    const hasChildren = categories.some((cat) => cat.categoryFatherId === category.id);

    const handleClick = () => {
        if (hasChildren) {
            setIsOpen((prev) => !prev); // Abrir o cerrar el submenú
        } else {
            onCategoryClick(category.id, category.type === "P"); // Si no tiene hijos, ejecutar la acción
        }
    };

    return (
        <div className="category-item">
            <span
                className={`category-label ${hasChildren ? 'has-children' : ''}`}
                onClick={handleClick}
            >
                {category.denomination}
            </span>
            {isOpen && hasChildren && (
                <div className="submenu">
                    {categories
                        .filter((cat) => cat.categoryFatherId === category.id)
                        .map((subCategory) => (
                            <CategoryItem
                                key={subCategory.id}
                                category={subCategory}
                                categories={categories}
                                onCategoryClick={onCategoryClick}
                            />
                        ))}
                </div>
            )}
        </div>
    );
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({ categories, onCategoryClick }) => {
    return (
        <>
            {categories
                .filter((cat) => cat.categoryFatherId === null)
                .map((category) => (
                    <CategoryItem
                        key={category.id}
                        category={category}
                        categories={categories}
                        onCategoryClick={onCategoryClick}
                    />
                ))}
        </>
    );
};

export default DropdownMenu;
   */