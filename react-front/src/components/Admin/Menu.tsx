import  { useState } from "react";
import {  ListGroup } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./Menu.css";

function Menu() {
 // const location = useLocation();
  const [selectedItem, setSelectedItem] = useState("");

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
  };

  return (
    <ListGroup className="row-menu">
      <Link to="/categoria">
        <ListGroup.Item
          action
          active={selectedItem === "category"}
          onClick={() => handleItemClick("category")}
        >
          Category
        </ListGroup.Item>
      </Link>
      <Link to="#link2">
        <ListGroup.Item
          action
          active={selectedItem === "user"}
          onClick={() => handleItemClick("user")}
        >
          User
        </ListGroup.Item>
      </Link>
      <Link to="/products">
        <ListGroup.Item
          action
          active={selectedItem === "products"}
          onClick={() => handleItemClick("products")}
        >
          Products
        </ListGroup.Item>
      </Link>
      <Link to="/ingredients">
        <ListGroup.Item
          action
          active={selectedItem === "ingredient"}
          onClick={() => handleItemClick("ingredient")}
        >
          Ingredient
        </ListGroup.Item>
      </Link>
      <Link to="/Mproducts">
        <ListGroup.Item
          action
          active={selectedItem === "ManufacturedProduct"}
          onClick={() => handleItemClick("ManufacturedProduct")}
        >
          Manufactured Product
        </ListGroup.Item>
      </Link>
      <Link to="/recipe">
        <ListGroup.Item
          action
          active={selectedItem === "Recipe"}
          onClick={() => handleItemClick("Recipe")}
        >
          Recipe
        </ListGroup.Item>
      </Link>
    </ListGroup>
  );
}

export default Menu;
