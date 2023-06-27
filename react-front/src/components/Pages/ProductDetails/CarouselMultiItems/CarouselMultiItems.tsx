// ---------------------------------------- COMPONENTE TEMPORAL ----------------------------------------
// ---------------------------- NO ESTA TOTALMENTE CON CONVENCIONES POR ESTO ---------------------------

// Importaciones de dependencias
import { useState } from "react";

// Importaciones de estilos
import "./CarouselMultiItems.css";

// ----------se cambiara en un futuro todo el componente, junto con esta interface que es para el JSON----------
interface Product {
  id: number;
  image: string;
  title: string;
  link: string;
  category_id: string;
}

/**
 * Propiedades del componente Carousel.
 * @prop {Product[]} items - Array de objetos Product que representa los elementos a mostrar en el carrusel.
 * @prop {number} itemsPerSlide - Número que indica la cantidad de elementos a mostrar por cada slide en el carrusel.
 */
interface CarouselProps {
  items: Product[];
  itemsPerSlide: number;
}

// eplicacion del componente
const CarouselMultiItems: React.FC<CarouselProps> = ({
  items,
  itemsPerSlide,
}) => {
  // Estados necesarios del componente
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = Math.ceil(items.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
  };

  // Renderizado del componente
  return (
    <div className="carousel">
      <div className="carousel__container">
        <div
          className="carousel__track"
          style={{
            transform: `translateX(-${currentSlide * (100 / itemsPerSlide)}%)`,
            transition: "transform 0.3s ease-in-out",
          }}
        >
          {items.map((item, index) => (
            <div key={index} className="carousel__item">
              <img src={item.image} className="carousel-image" />
            </div>
          ))}
          {items.map((item, index) => (
            <div key={`clone-${index}`} className="carousel__item">
              <img src={item.image} className="carousel-image" />
            </div>
          ))}
        </div>
      </div>
      <button className="carousel__prev" onClick={prevSlide}>
        Prev
      </button>
      <button className="carousel__next" onClick={nextSlide}>
        Next
      </button>
    </div>
  );
};

export default CarouselMultiItems;
