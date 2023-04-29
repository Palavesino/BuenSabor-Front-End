import { Routes, Route } from "react-router-dom";
import "./App.css";
import NavBar from "./componentes/NavBar/NavBar";

function App() {
  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<h1>Home</h1>}></Route>
        <Route path="/productos" element={<h1>Productos</h1>}></Route>
        <Route path="/promociones" element={<h1>Promociones</h1>}></Route>
        <Route path="/formulario" element={<h1>Formulario</h1>}></Route>
        <Route path="/carrito" element={<h1>Carrito</h1>}></Route>
      </Routes>
    </>
  );
}

export default App;
