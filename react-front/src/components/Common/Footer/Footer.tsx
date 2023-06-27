// Importacion de dependencias
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

// Importacion de estilos
import "./Footer.css"

/*
 * Componente de pie de página.
 * El componente muestra información de contacto, enlaces a redes sociales y créditos de derechos de autor y desarrollador.
 */
const Footer = () => {
  // Renderizado del componente
  return (
    <footer>
      <Container fluid className="container-footer">
        <Row>
          <Col className="social-icons-col">
            <div className="circle-icon-container">
              <FaFacebookF className="icon-footer-fb" />
            </div>
            <div className="circle-icon-container">
              <FaTwitter className="icon-footer-tw" />
            </div>
            <div className="circle-icon-container">
              <FaInstagram className="icon-footer-ig" />
            </div>
          </Col>

          <Col className="logo-col">
            <div className="logo-footer"></div>
          </Col>

          <Col className="info-col">
            <p>
              <a href="#">Contacto</a>
            </p>
            <p>
              <a href="#">Sobre Nosotros</a>
            </p>
          </Col>
        </Row>
        
        <Row className="second-row">
          <Col className="copy-col" md={4}>
            <p>©2023 elbuensabor restaurante All Rights reserved.</p>
          </Col>

          <Col className="developer-col" md={5}>
            <p>Powered by Power Rangers</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;