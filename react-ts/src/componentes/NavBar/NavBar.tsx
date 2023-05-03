import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NavBar.css";
import { BsCart3, BsPersonCircle } from "react-icons/bs";
import { CiDiscount1 } from "react-icons/ci";
import { IoFastFoodOutline, IoSearch } from "react-icons/io5";
//import { MdOutlineNoFood } from "react-icons/md";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Form,
  Button,
  Col,
  Row,
} from "react-bootstrap";
import LogoutButton from "./LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import { Link, NavLink } from "react-router-dom";

const NavBar = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  if (isLoading) return <h1>Loding...</h1>;
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
              <span className="iconoProductoPromocion">
                <IoFastFoodOutline />
              </span>
            </Link>

            <Link to="/promociones" className="item">
              Promociones{" "}
              <span className="iconoProductoPromocion">
                <CiDiscount1 />
              </span>
            </Link>
            <Link to="/rubro" className="item">
              Rubro
            </Link>

            <Row>
              <Col>
                <div className="box">
                  <div className="container-4">
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
                  className=" iconoUser  dropdown-menu-right"
                >
                  <NavDropdown.Item href="#action3" className="text-truncate">
                    <p>{user?.name}</p>
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action4" className="text-truncate">
                    <p> {user?.email}</p>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action5">
                    <LogoutButton />
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <LoginButton />
            )}
            <Link to="/carrito" className="iconoCarrito item">
              <BsCart3 />
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
