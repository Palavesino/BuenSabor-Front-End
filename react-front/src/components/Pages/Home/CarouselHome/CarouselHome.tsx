// Importacion de dependencias
import { CCarousel, CCarouselItem, CImage } from "@coreui/react";

// Importacion de estilos
import "bootstrap/dist/css/bootstrap.min.css";
import "./CarouselHome.css";

/**
 * Propiedades del componente CarouselHome.
 * @prop {string[]} images - Array de strings que representa las rutas de las imágenes que se mostrarán en el carrusel.
 */
interface CarouselHomeProps {
  images: string[];
}

/*
 *El componente muestra una secuencia de imágenes en forma de carrusel.
 *Utiliza el componente CCarousel de la biblioteca @coreui/react para renderizar el carrusel.
 *Las imágenes se pasan como una matriz a través de la prop "images".
 *Cada imagen se representa como un CCarouselItem y se muestra utilizando el componente CImage.
 */
const CarouselHome: React.FC<CarouselHomeProps> = ({ images }) => {
  // Renderizado del componente
  return (
    <CCarousel controls indicators={true} interval={false}>
      {images.map((image, index) => (
        <CCarouselItem key={index}>
          <CImage className="d-block" src={image} alt={`slide ${index + 1}`} />
        </CCarouselItem>
      ))}
    </CCarousel>
  );
};

export default CarouselHome;
