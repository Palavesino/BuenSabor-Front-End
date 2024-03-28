// Importaciones de dependencias
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { UserSingUp } from "./components/Auth0/SignUp/UserSignUp";
// Importaciones de componentes, funciones y modelos
import Footer from "./components/Common/Footer/Footer";
import Home from "./components/Pages/Home/Home";
import NavBar from "./components/Common/NavBar/NavBar";
import Products from "./components/Pages/Products/Products";
import ListarCategorys from "./components/Admin/CategoriesComponents/CategoryTable";
import ProductTable from "./components/Admin/ProductComponents/ProductTable";
import IngredientTable from "./components/Admin/IngredientComponents/IngredientTable";
import M_ProductTable from "./components/Admin/ManufacturedProductComponents/M_ProductTable";
import RecipesTable from "./components/Admin/RecipeComponents/RecipeTable";
import ProductDetails from "./components/Pages/ProductDetails/ProductDetails";
import Menu from "./components/Admin/Menu";
import UserTable from "./components/Admin/UserComponents/UserTable";

// Importaciones de Assets
import products from "./components/Pages/Products/JSON/products.json";
import categories from "./components/Pages/Products/JSON/categories.json";

// Importaciones de estilos
import "./App.css";
import "react-toastify/dist/ReactToastify.css";




function App() {
  //Inicializar una variable con un valor obtenido del almacenamiento local, o true si no hay ningún valor almacenado.
  const [firstLogIn, setFirstLogIn] = useState(() => {
    const persistedFirstLogIn = localStorage.getItem('firstLogIn');
    return persistedFirstLogIn !== null ? JSON.parse(persistedFirstLogIn) : true;

  });
  // Renderizado del componente
  return (
    <div className="root">
      {firstLogIn ? <UserSingUp firstLogIn={firstLogIn} setFirstLogIn={setFirstLogIn} /> : null}
      <NavBar />
      <div className="main-container">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/products" element={<ProductTable />}></Route>
          <Route path="/ingredients" element={<IngredientTable />}></Route>
          <Route path="/Mproducts" element={<M_ProductTable />}></Route>
          <Route path="/recipe" element={<RecipesTable />}></Route>
          <Route path="/user" element={<UserTable />}></Route>
          <Route
            path="/productos"
            element={<Products products={products} categories={categories} />}
          ></Route>
          <Route path="/promociones" element={<h1>Promociones</h1>}></Route>
          <Route path="/categoria" element={<ListarCategorys />}></Route>
          <Route path="/admin" element={<Menu />}></Route>
          <Route path="/carrito" element={<h1>Carrito</h1>}></Route>
          <Route
            path="/productos/:productId"
            element={<ProductDetails products={products} />}
          />
        </Routes>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
