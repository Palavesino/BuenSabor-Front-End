// Importacion de dependencias
import { useAuth0 } from "@auth0/auth0-react";
import { Navbar, Container, Nav, NavDropdown, Form, Button} from "react-bootstrap";
import { BsCart3, BsPersonCircle } from "react-icons/bs";
import { AiOutlineHome } from "react-icons/ai";
import { TbDiscount2 } from "react-icons/tb";
import { IoFastFoodOutline, IoSearch } from "react-icons/io5";
//import { MdOutlineNoFood } from "react-icons/md";

// Importaciones de componentes, funciones y modelos
import LoginButton from "./LoginButton/LoginButton";
import LogoutButton from "./LogoutButton/LogoutButton";
import {MenuDes} from "./MenuDesplegable/MenuDes"; "./MenuDesplegable/MenuDes";
import InputDropdown from "./InputDropdown/InputDropdown";


// Importacion de estilos
import "bootstrap/dist/css/bootstrap.min.css";
import "./NavBar.css";
import { Link } from "react-router-dom";





/*
 *Componente de barra de navegación.
 *El componente muestra una barra de navegación con diferentes enlaces y opciones, dependiendo del estado de autenticación del usuario.
 *Utiliza el hook useAuth0() para obtener la información del usuario, como su estado de autenticación, información del usuario y opciones de cierre de sesión.
 *Si el estado de carga es isLoading, se muestra un mensaje de "Cargando..." en lugar del contenido de la barra de navegación.
 */


 
const NavBar = () => {
  const { user, isAuthenticated, isLoading } = useAuth0(); // Se obtiene la información del usuario, su estado de autenticación y el estado de carga
  if (isLoading) return <h1>Loading...</h1>; // Si isLoading es true, significa que la información del usuario aún se está cargando (se mostrara un mensaje de loading...)

  
  // Renderizado del componente
  return (
    <Navbar bg="light" expand="lg" className="nav">
      <Container fluid>
         
         <MenuDes/>
         <Navbar.Brand href="/" className="logo" />
       
         <Navbar.Collapse id="navbarScroll">
          <Nav>

  
            <Link to="/" className="size-item">
          
                <div className="item">
                  <AiOutlineHome/>
                  
                </div>         
            </Link>

            <Link to="/productos" className="size-item">
                <div className="item">
                <IoFastFoodOutline/>
                </div>
              
            </Link>

            <Link to="/promociones" className="size-item">
                <div className="item">
                <TbDiscount2 />
                </div>
            </Link>

           
            </Nav>
          
          <InputDropdown/>
          
       
                
         
          
          <Nav>
            {isAuthenticated ? (
              <>
                <NavDropdown
                  title={<BsPersonCircle className="color-icon"/>}
                  className="user-icon"
                >
                  
                  <NavDropdown.Item href="#action3" className="text-truncate">
                    <p>{user?.name}</p>
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action4" className="text-truncate">
                    <p>{user?.email}</p>
                  </NavDropdown.Item>

                  <NavDropdown.Item href="/categoria" className="text-truncate">
                    <p>admin</p>
                  </NavDropdown.Item>
                  {/* <NavDropdown.Divider /> */}
                  <NavDropdown.Item href="#action5" className="button-logout">
                    <LogoutButton />
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <LoginButton />
            )}

            
          </Nav>
            
          
          
        </Navbar.Collapse>
        
        <Link to="/carrito" className="carrito-item">
                <div className="carrito">
                <BsCart3 />
                </div>
        </Link>
       
      </Container>
    </Navbar>
  );
};

export default NavBar;
