// Importaciones de componentes, funciones y modelos
import { CardHome, CardHomeRight } from "./CardHome/CardHome";
import CarouselHome from "./CarouselHome/CarouselHome";

// Importaciones de Assets
import promotionImage from "../../../assets/images/LP_PI.png";
import combosImage from "../../../assets/images/LP_CI.png";
import menuImage from "../../../assets/images/LP_MI.png";

// Definicion de array de imagenes
const imagesCarousel = [
  "https://media.istockphoto.com/id/1232401725/es/foto/escena-de-la-mesa-de-comidas-variadas-para-llevar-o-entregar-vista-de-arriba-hacia-abajo-en-un.jpg?s=1024x1024&w=is&k=20&c=5VlRfEDe_gqnuha6imIiPRRcWSR5yx-fum3A9kbZ5Qs=",
  "https://media.istockphoto.com/id/1155362263/es/foto/cocina-tradicional-turca-pizza-turca-pita-con-un-relleno-diferente-carne-queso-rodajas-de.jpg?s=1024x1024&w=is&k=20&c=5SUcp-L1xRehKfA0eXQTnziZb_mFuA_dIc675GOS9kw=",
  "https://media.istockphoto.com/id/1218641943/es/foto/desayuno-desayuno-tostadapan-y-patatas-fritas.jpg?s=1024x1024&w=is&k=20&c=jl6eCxNEw7GLnVEKFHwcmTeszByF_y-6HUefEZTcV8Y=",
  "https://media.istockphoto.com/id/1439279068/es/foto/primer-plano-de-alto-%C3%A1ngulo-de-pizzas-y-hamburguesas-en-una-mesa-de-madera.jpg?s=1024x1024&w=is&k=20&c=mAfz4wrnguN602O9HCjt4zUDksHgzg3bn42dfHYne-M=",
];

/*
 *El componente representa la página principal de la aplicación.
 *Contiene varios componentes reutilizables para mostrar contenido relevante.
 *Utiliza el componente Carousel para mostrar imágenes destacadas en un carrusel.
 *Utiliza el componente Card y CardRight para mostrar tarjetas informativas con imágenes, título, descripción y botón de acción.
 *Cada tarjeta representa una sección de la página, como promociones, combos y menú.
 */
const Home = () => {
  // Renderizado del componente
  return (
    <div className="home-page">
      <CarouselHome images={imagesCarousel} />
      <CardHome
        image={promotionImage}
        title="Promociones"
        description={`Hemos creado una selección especial de nuestros platillos más populares y ofertas irresistibles que no puedes perderte. Ya sea que busques un almuerzo rápido y sabroso o una cena para toda la familia, tenemos opciones para todos los gustos y presupuestos. No esperes más para probar nuestros deliciosos platillos a precios exclusivos.`}
        button_text="Mirar Promociones"
      />

      <CardHomeRight
        image={combosImage}
        title="Combos"
        description={`¡Descubre nuestros combos de comida y ahorra en grande en cada bocado! Combinamos los mejores sabores y productos para ofrecerte la mejor experiencia gastronómica, sin sacrificar tu bolsillo. ¡No te quedes con las ganas y prueba nuestras opciones de combos hoy mismo!`}
        button_text="Mirar Combos"
      />

      <CardHome
        image={menuImage}
        title="Menu"
        description={`Desde nuestros platos clásicos hasta nuestras opciones más innovadoras, hemos creado un menú cuidadosamente seleccionado para satisfacer tus antojos culinarios.

        Ordena, paga fácilmente desde cualquier dispositivo móvil o computadora, y a travez de nuestro servicio de entrega rápida y confiable tus alimentos llegaran frescos y calientes.`}
        button_text="Mirar Menu"
      />
    </div>
  );
};

export default Home;