// Importaciones de dependencias
import {
  CCard,
  CRow,
  CCol,
  CCardImage,
  CCardBody,
  CCardTitle,
  CCardText,
  CButton,
} from "@coreui/react";

// Importaciones de estilos
import "./CardHome.css";

/**
 * Propiedades del componente CardHome.
 * @prop {string} title - Título del card, de tipo string.
 * @prop {string} description - Descripción del card, de tipo string.
 * @prop {string} image - Ruta de la imagen del card, de tipo string.
 * @prop {string} button_text - Texto del botón del card, de tipo string.
 */
interface CardHomeProps {
  title: string;
  description: string;
  image: string;
  button_text: string;
}

/*
 * Componente para mostrar un card.
 * El componente muestra un card con título, descripción, imagen y un botón.
 * Utiliza las propiedades `title`, `description`, `image` y `button_text` para personalizar el contenido del card.
 * El card se renderiza utilizando componentes de la librería `coreui-react`, como `CCard`, `CCardImage`, `CCardBody`, `CCardTitle`, `CCardText` y `CButton`.
 */
const CardHome: React.FC<CardHomeProps> = ({
  title,
  description,
  image,
  button_text,
}: CardHomeProps) => {
  // Renderizado del componente
  return (
    <div>
    <CCard
   className="home-card"
   style={{ backgroundColor: "transparent", border:"none"}}       
    >
      <CRow>
        <CCol md={7}>
        <CCardImage src={image} />
        </CCol>

        <CCol md={5}>
          <CCardBody>
            <CCardTitle className="title-card">{title}</CCardTitle>
            <CCardText className="description-card">{description}</CCardText>
            <CButton
              className="button"
              style={{marginLeft:"0rem",marginTop: "10%",width: "15rem",fontSize: "1.5rem",borderColor: "#F6BD5A",color: "#F6BD5A",boxShadow: "inset 11px 20px 9px -20px rgba(255, 201, 0, 0.4)",background: "#111",borderRadius: "2rem"}}
              href="#"
            >
              {button_text}
            </CButton>
          </CCardBody>
        </CCol>
      </CRow>
    </CCard>
    </div>
  );
};

/*
 * Componente para mostrar un card en la parte derecha.
 * El componente muestra un card con título, descripción, imagen y un botón, donde la imagen se encuentra en la parte derecha.
 * Utiliza las propiedades `title`, `description`, `image` y `button_text` para personalizar el contenido del card.
 * El card se renderiza utilizando componentes de la librería `coreui-react`, como `CCard`, `CCardImage`, `CCardBody`, `CCardTitle`, `CCardText` y `CButton`.
 */
const CardHomeRight = ({
  title,
  description,
  image,
  button_text,
}: CardHomeProps) => {
  return (
    <CCard
      className="home-card"
      style={{ backgroundColor: "transparent", border: "none" }}
    >
      <CRow className="g-0">
        <CCol md={5}>
          <CCardBody>
            <CCardTitle className="title-card">{title}</CCardTitle>
            <CCardText className="description-card">{description}</CCardText>
            <CButton
              className="card-button"
              style={{marginLeft:"0rem",marginTop: "10%",width: "15rem",fontSize: "1.5rem",borderColor: "#F6BD5A",color: "#F6BD5A",boxShadow: "inset 11px 20px 9px -20px rgba(255, 201, 0, 0.4)",background: "#111",borderRadius: "2rem"}}
              href="#"
            >
              {button_text}
            </CButton>
          </CCardBody>
        </CCol>

        <CCol md={7}>
          <CCardImage src={image} />
        </CCol>
      </CRow>
    </CCard>
  );
};

export { CardHome, CardHomeRight };
