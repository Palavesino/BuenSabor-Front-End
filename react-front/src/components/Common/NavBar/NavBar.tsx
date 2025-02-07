// Importacion de dependencias
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Navbar, Container, Nav, NavDropdown, Col, Row } from "react-bootstrap";
import { BsCart3, BsPersonCircle } from "react-icons/bs";
// import { CiDiscount1 } from "react-icons/ci";
import { IoFastFoodOutline, IoSearch } from "react-icons/io5";
import { usePermission } from "../../../context/PermissionContext";
//import { MdOutlineNoFood } from "react-icons/md";

// Importaciones de componentes, funciones y modelos
import LoginButton from "./LoginButton/LoginButton";
import LogoutButton from "./LogoutButton/LogoutButton";

// Importacion de estilos
import "bootstrap/dist/css/bootstrap.min.css";
import "./NavBar.css";
import { UserRole } from "../../Enum/UserRole";

/*
 *Componente de barra de navegación.
 *El componente muestra una barra de navegación con diferentes enlaces y opciones, dependiendo del estado de autenticación del usuario.
 *Utiliza el hook useAuth0() para obtener la información del usuario, como su estado de autenticación, información del usuario y opciones de cierre de sesión.
 *Si el estado de carga es isLoading, se muestra un mensaje de "Cargando..." en lugar del contenido de la barra de navegación.
 */
const NavBar = () => {
  const { user, isAuthenticated, isLoading } = useAuth0(); // Se obtiene la información del usuario, su estado de autenticación y el estado de carga
  const { permission } = usePermission();
  if (isLoading) return null; // Si isLoading es true, significa que la información del usuario aún se está cargando (se mostrara un mensaje de loading...)

  // Renderizado del componente
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/" className="logo" />
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Link to="/" className="item">
              Home
            </Link>

            <Link to="/productos" className="item">
              Productos{" "}
              <span className="product-promotion-icon">
                <IoFastFoodOutline />
              </span>
            </Link>
            {isAuthenticated && (
              <>
                {permission === UserRole.cajero && (
                  <Link to="/cajero" className="item">Cajero</Link>
                )}
                {permission === UserRole.delivery && (
                  <Link to="/delivery" className="item">Delivery</Link>
                )}
                {permission === UserRole.cocinero && (
                  <Link to="/cocinero" className="item">Cocinero</Link>
                )}
                {permission === UserRole.admin && (
                  <Link to="/estadistica" className="item">Estadística</Link>
                )}
              </>
            )}
            {/* <Link to="/promociones" className="item">
              Promociones{" "}
              <span className="product-promotion-icon">
                <CiDiscount1 />
              </span>
            </Link> */}

            <Row>
              <Col>
                <div className="box">
                  <div className="search-container">
                    <input type="search" id="search" placeholder="Search..." />
                    <button className="icon">
                      <i>
                        <IoSearch />
                      </i>
                    </button>
                  </div>
                </div>
              </Col>
            </Row>
            {isAuthenticated ? (
              <>
                <NavDropdown
                  title={<BsPersonCircle />}
                  className="user-icon dropdown-menu-right"
                >
                  <NavDropdown.Item href="/private/profile" className="text-truncate">
                    <p>{user?.name}</p>
                  </NavDropdown.Item>
                  {(permission === UserRole.admin || permission === UserRole.cocinero) && (
                    <NavDropdown.Item href="/private/categoria" className="text-truncate">
                      <p>{permission}</p>
                    </NavDropdown.Item>
                  )}
                  {permission === UserRole.user && (
                    <NavDropdown.Item href="/private/user/orders" className="text-truncate">
                      <p>Historial</p>
                    </NavDropdown.Item>
                  )}
                  {/* <NavDropdown.Divider /> */}
                  <NavDropdown.Item href="#action5">
                    <LogoutButton />
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <LoginButton />
            )}

            <Link to="/carrito" className="shopping-cart-icon item">
              <BsCart3 />
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
