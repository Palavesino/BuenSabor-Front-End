import { useState } from "react";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Menu.css";

function Menu() {
  const [selectedItem, setSelectedItem] = useState("");

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
  };

  return (
    <ListGroup className="row-menu">
      <Link to="/private/categoria">
        <ListGroup.Item
          action
          active={selectedItem === "category"}
          onClick={() => handleItemClick("category")}
        >
          Category
        </ListGroup.Item>
      </Link>
      <Link to="/private/user">
        <ListGroup.Item
          action
          active={selectedItem === "user"}
          onClick={() => handleItemClick("user")}
        >
          User
        </ListGroup.Item>
      </Link>
      <Link to="/private/products">
        <ListGroup.Item
          action
          active={selectedItem === "products"}
          onClick={() => handleItemClick("products")}
        >
          Products
        </ListGroup.Item>
      </Link>
      <Link to="/private/ingredients">
        <ListGroup.Item
          action
          active={selectedItem === "ingredient"}
          onClick={() => handleItemClick("ingredient")}
        >
          Ingredient
        </ListGroup.Item>
      </Link>
      <Link to="/private/stock">
        <ListGroup.Item
          action
          active={selectedItem === "stock"}
          onClick={() => handleItemClick("stock")}
        >
          Stock
        </ListGroup.Item>
      </Link>
      <Link to="/private/Mproducts">
        <ListGroup.Item
          action
          active={selectedItem === "ManufacturedProduct"}
          onClick={() => handleItemClick("ManufacturedProduct")}
        >
          Manufactured Product
        </ListGroup.Item>
      </Link>
      <Link to="/private/recipe">
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
