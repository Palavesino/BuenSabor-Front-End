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
    <CCard
      className="card-home"
      style={{ backgroundColor: "transparent", border: "none" }}
    >
      <CRow className="g-0">
        <CCol md={7}>
          <CCardImage src={image} />
        </CCol>

        <CCol md={5}>
          <CCardBody>
            <CCardTitle className="card-title">{title}</CCardTitle>
            <CCardText className="card-description">{description}</CCardText>
            <CButton
              style={{
                borderColor: "#F6BD5A",
                color: "#F6BD5A",
                boxShadow: "inset 11px 20px 9px -20px rgba(255, 201, 0, 0.4)",
                background: "#111",
                borderRadius: "2rem",
              }}
              className="card-button"
              href="#"
            >
              {button_text}
            </CButton>
          </CCardBody>
        </CCol>
      </CRow>
    </CCard>
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
      className="card-home"
      style={{ backgroundColor: "transparent", border: "none" }}
    >
      <CRow className="g-0">
        <CCol md={5}>
          <CCardBody>
            <CCardTitle className="card-title">{title}</CCardTitle>
            <CCardText className="card-description">{description}</CCardText>
            <CButton
              className="card-button"
              style={{
                borderColor: "#F6BD5A",
                color: "#F6BD5A",
                boxShadow: "inset 11px 20px 9px -20px rgba(255, 201, 0, 0.4)",
                background: "#111",
                borderRadius: "2rem",
              }}
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
