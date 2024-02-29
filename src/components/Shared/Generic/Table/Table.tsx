// Importaciones de dependencias
import React from "react";
import { Table } from "react-bootstrap";

// Imprtaciones de estilos
import "./Table.css";

/**
 * Define una columna en una tabla genérica.
 * @prop {string} label - Etiqueta de la columna.
 * @prop {string | number} width - Ancho opcional de la columna.
 */
export interface Column {
  label: string;
  width?: string | number;
}

/**
 * Propiedades del componente de tabla genérica.
 * @prop {Column[]} columns - Define las columnas de la tabla.
 * @prop {any[][]} data - Define los datos de la tabla.
 */
interface GenericTableProps {
  columns: Column[];
  data: any[][];
}

/**
 * Componente de tabla
 * El componente muestra una tabla con las columnas y los datos especificados.
 * Utiliza las propiedades `columns` y `data` para personalizar el contenido de la tabla.
 */
const GenericTable: React.FC<GenericTableProps> = ({ columns, data }) => {
  if (!Array.isArray(columns) || !Array.isArray(data)) {
    return null; // Mostrar null o un mensaje de error según corresponda
  }

  // Renderizado del componente
  return (
    <div>
      <Table striped bordered hover variant="dark" className="table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} style={{ width: column.width }}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export { GenericTable };
