import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { getRubroJSON } from "../Servicios/RubroSerive";
import Rubro from "../Model/Rubro";

type Props = {
  rubros: Rubro[];
  onDelete: (rubro: Rubro) => void;
  onEdit: (rubro: any) => void;
};

const ListarRubros = ({ rubros, onDelete, onEdit }: Props) => {
  return (
    <>
      <h1>Lista de Rubros</h1>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>#</th>
          </tr>
        </thead>
        <tbody>
          {rubros.map((rubro: Rubro) => (
            <tr key={rubro.id}>
              <td>{rubro.id}</td>
              <td>{rubro.nombre}</td>
              <td>{rubro.estado ? "Activo" : "Inactivo"}</td>
              <td>
                <Button variant="success" onClick={() => onEdit(rubro)}>
                  Editar
                </Button>{" "}
                <Button variant="danger" onClick={() => onDelete(rubro)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};
export default ListarRubros;
