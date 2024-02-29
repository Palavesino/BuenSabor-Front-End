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
          <Col>
          <div className="social-icons-col">
            <a className="circle-icon-container" href="https://facebook.com/" >
              <FaFacebookF className="icon-footer" />
            </a>
            <a className="circle-icon-container" href="https://twitter.com/">
              <FaTwitter className="icon-footer" />
            </a>
            <a className="circle-icon-container"  href="https://instagram.com/">
              <FaInstagram className="icon-footer" />
            </a>
          </div>
             <Row style={{marginTop:"3.1rem",marginLeft:"5rem"}}>
               <Col className="copy-col" md={10}>
               <p>©2023 elbuensabor restaurante All Rights reserved.</p>
                </Col>
              </Row>
          </Col>

          <Col>
          <div className="logo-col">
            <div className="logo-footer"></div>
            <Col className="developer-col" md={10}>
            <p>Powered by Power Rangers</p>
          </Col>
          </div>
          </Col>

          <Col>
          <div className="info-col">
            <Row>
              <p>CONTACTOS</p>
              <Row><p>BuenSabor.Reclamos@gmail.com</p></Row>
              <Row><p>BuenSabor.AtencionCl@gmail.com</p></Row>
            </Row>
            <Row>
              <p style={{ marginLeft: "-0.9rem"}}>TELEFONOS</p>
             <Row><p>261-234-3456</p></Row>
             <Row><p>+56-261-234-3456</p></Row>
            </Row>
          </div>
          </Col>
        </Row>
        
       
      </Container>
    </footer>
  );
};

export default Footer;