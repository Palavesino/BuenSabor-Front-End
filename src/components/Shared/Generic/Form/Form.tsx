// Importaciones de dependencias
import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";

// Importaciones de estilos
import "./Form.css";

/**
 * Define una agrupación de campos en el formulario.
 * @prop {string} label - Etiqueta de la agrupación.
 * @prop {string | number} width - Ancho opcional de la agrupación.
 * @prop {string} type - Tipo de la agrupación.
 */
interface Group {
  label: string;
  width?: string | number;
  type: string;
}

/**
 * Define una opción de selección en el formulario.
 * @prop {string} option - Opción de selección.
 * @prop {string | number} width - Ancho opcional de la opción de selección.
 * @prop {string} value - Valor de la opción de selección.
 */
interface Select {
  option: string;
  width?: string | number;
  value: string;
}

/**
 * Define un campo en el formulario.
 * @prop {string} label - Etiqueta del campo.
 */
interface Field {
  label: string;
}

/**
 * Propiedades del componente del formulario.
 * @prop {Group[]} labels - Propiedad opcional que define las etiquetas y propiedades de los campos del formulario.
 * @prop {string | number} widthCard - Propiedad opcional que define el ancho del componente Card del formulario.
 * @prop {string | number} heightCard - Propiedad opcional que define la altura del componente Card del formulario.
 * @prop {Select[]} selects - Propiedad opcional que define las opciones de selección del formulario.
 */
interface GenericFormProps {
  labels?: Group[]; // Propiedad opcional que define las etiquetas y propiedades de los campos del formulario
  widthCard?: string | number; // Propiedad opcional que define el ancho del componente Card del formulario
  heightCard?: string | number; // Propiedad opcional que define la altura del componente Card del formulario
  selects?: Select[]; // Propiedad opcional que define las opciones de selección del formulario
}

/*
 * Componente de formulario
 * El componente muestra un formulario con campos y opciones seleccionables.
 * Utiliza las propiedades `labels`, `widthCard`, `heightCard` y `selects` para personalizar el contenido del formulario.
 * Al enviar el formulario, se ejecuta la función `handleSubmit` que imprime los campos y la opción seleccionada en la consola.
 * Los campos del formulario se actualizan utilizando la función `handleLabelChange` cuando hay cambios en los campos.
 * La opción seleccionada se actualiza utilizando la función `handleSelectChange` cuando hay cambios en el elemento de selección.
 */
const GenericForm: React.FC<GenericFormProps> = ({
  labels,
  widthCard,
  heightCard,
  selects,
}) => {
  // Estados necesarios del componente
  const [fields, setFields] = useState<Field[]>([]); // Estado que almacena los campos del formulario
  const [selectedOption, setSelectedOption] = useState(""); // Estado que almacena la opción seleccionada del formulario

  const handleLabelChange = (index: number, value: string) => {
    const updatedFields = [...fields]; // Crear una copia del estado de los campos del formulario

    if (updatedFields[index]) {
      updatedFields[index].label = value; // Actualizar la etiqueta del campo existente en el índice dado
    } else {
      updatedFields[index] = { label: value }; // Crear un nuevo campo con la etiqueta dada en el índice dado
    }
    setFields(updatedFields); // Actualizar el estado de los campos del formulario con los cambios realizados
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value); // Actualizar el estado de la opción seleccionada con el valor del elemento de selección
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(fields); // Imprimir en la consola los campos del formulario
    console.log(selectedOption); // Imprimir en la consola la opción seleccionada del formulario
  };

  // Renderizado del componente
  return (
    <div>
      <Card
        className="card-generic"
        style={{ width: widthCard, height: heightCard }}
      >
        <Form onSubmit={handleSubmit}>
          <h3>Formulario</h3>

          {labels?.map((label, index) => (
            <Form.Group key={index} style={{ width: label.width }}>
              <Form.Label>{label.label}</Form.Label>
              <Form.Control
                type={label.type}
                placeholder={`Ingrese ${label.label}`}
                onChange={(e) => handleLabelChange(index, e.target.value)}
                required
              />
            </Form.Group>
          ))}

          {selects && (
            <Form.Select
              aria-label="Opciones de selección"
              required
              onChange={handleSelectChange}
            >
              {selects.map((select, index) => (
                <option key={index} value={select.value}>
                  {select.option}
                </option>
              ))}
            </Form.Select>
          )}

          <Button variant="primary" type="submit" className="butt">
            Guardar
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default GenericForm;
