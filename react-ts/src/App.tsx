import { Routes, Route } from "react-router-dom";
import "./App.css";
import NavBar from "./componentes/NavBar/NavBar";
import { useEffect, useState } from "react";
import Rubro from "./componentes/Model/Rubro";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import FormularioRubros from "./componentes/TablaRubros/FormularioRubros";
import ListarRubros from "./componentes/TablaRubros/ListarRubros";

function App() {
  const [rubros, setRubros] = useState([]);
  const [rubro, setRubro] = useState<Rubro>();
  const cargarRubros = () => {
    axios
      .get("http://localhost:8080/tarea/lista")
      .then(({ data }) => setRubros(data));
  };
  useEffect(cargarRubros, []);

  const onSubmit = (values: any) => {
    if (rubro) {
      console.log("http://localhost:8080/tarea/update/" + rubro.id, values);
      axios
        .put("http://localhost:8080/tarea/update/" + rubro.id, values)
        .then(() => {
          cargarRubros();
        });
    } else {
      console.log("http://localhost:8080/tarea/create", values);
      axios
        .post("http://localhost:8080/tarea/create", values)
        .then(() => cargarRubros());
    }
  };
  const eliminarRubros = (rubro: Rubro) => {
    axios
      .delete("http://localhost:8080/tarea/delete/" + rubro.id)
      .then(() => cargarRubros());
  };
  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<h1>Home</h1>}></Route>
        <Route path="/productos" element={<h1>Productos</h1>}></Route>
        <Route path="/promociones" element={<h1>Promociones</h1>}></Route>
        <Route
          path="/rubro"
          element={
            <>
              <Container>
                <Row>
                  <Col md={6}>
                    <ListarRubros
                      rubros={rubros}
                      onDelete={eliminarRubros}
                      onEdit={(rubro) => setRubro(rubro)}
                    />
                  </Col>
                  <Col md={6}>
                    <FormularioRubros
                      onSubmit={onSubmit}
                      rubro={rubro}
                      setRubro={setRubro}
                    />
                  </Col>
                </Row>
              </Container>
            </>
          }
        >
          {" "}
        </Route>
        <Route path="/carrito" element={<h1>Carrito</h1>}></Route>
      </Routes>
    </>
  );
}

export default App;
