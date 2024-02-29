import React, { useState } from "react";
import { Placeholder } from "react-bootstrap";
import Select from "react-select";
// @ts-ignore
import { ValueType } from "react-select";

interface fuit {
  value: string;
  label: string;
}

const fruits: fuit[] = [
  { value: "appleeee", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "orange", label: "Orange" },
  { value: "grape", label: "Grape" },
  { value: "watermelon", label: "Watermelon" },
];

const InputDropdown: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<ValueType<fuit, true>>(
    null
  );

  const handleChange = (selectedOption: ValueType<fuit, true>) => {
    setSelectedOption(selectedOption);
  };

  return (
    
    <div style={{position:"relative", left:"20rem" }}>
      <Select
        options={fruits}
        value={selectedOption}
        onChange={handleChange}
        placeholder="Select a food..."
        isClearable
        classNamePrefix="inputdrop"
        styles={{
            container: (provided) => ({ 
              ...provided, 
              zIndex: 9999,
             }),
  
            control: (provided) => ({
              ...provided,
              backgroundColor: "", // Color de fondo del contenedor rgb(220, 220, 220)
              color: "white", // Color del texto
              border: "0.2rem solid white", // Borde del contenedor
              borderRadius: "0.5rem", // Borde redondeado
              "&:hover": {
                borderColor: "#f6bd5a", // Color del borde al pasar el mouse
              },
             
            }),
            singleValue: (provided) => ({
                ...provided,
                color: "white", // Color del texto seleccionado
              }),
            input: (provided) => ({
              ...provided,
              fontSize: "1rem", // Cambiar el tamaño de fuente del input
              width:"20rem",
              color:"white"
              
            }),
            placeholder: (provided) => ({
                ...provided,
                color: "white", // Color del texto del placeholder
              }),
            clearIndicator: (provided) => ({
                ...provided,
                color: "white", // Color del icono de la cruzeta
                "&:hover": {
                  color: "#f6bd5a", // Color del icono de la cruzeta al pasar el mouse
                },
              }),
            dropdownIndicator: (provided) => ({
                ...provided,
                color: "white", // Color del botón que abre el dropdown
                "&:hover": {
                  color: "#f6bd5a", // Color del botón que abre el dropdown al pasar el mouse
                },
              }),
            menu: (provided) => ({
                ...provided,
                backgroundColor: "gray", // Color de fondo del menú desplegable
                
              }),
            option: (provided) => ({
                ...provided,
                backgroundColor: "gray", // Color de fondo de las opciones
                color: "black", // Color del texto de las opciones
                "&:hover": {
                  backgroundColor: "lightgray", // Color de fondo al pasar el mouse
                  color: "white", // Color del texto al pasar el mouse
                },
              }),
          }}
      />
      {selectedOption && (
        <div>
         
        </div>
      )}
    </div>
  );
};

export default InputDropdown;
/*
 <h2>Selected Fruit:</h2>

<p>{(selectedOption as fuit).value}</p>

 classNamePrefix="my-select" // Definimos el prefijo de la clase para el dropdown
        styles={{
          container: (provided) => ({ 
            ...provided, zIndex: 9999 }),

          control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? "blue" : "gray", // Cambiar el color del borde al estar enfocado o no
            "&:hover": { borderColor: "green" }, // Cambiar el color del borde al pasar el mouse
          }),

          singleValue: (provided) => ({
            ...provided,
            color: "red", // Cambiar el color del texto seleccionado
          }),

          input: (provided) => ({
            ...provided,
            backgroundColor: "lightgray", // Cambiar el color de fondo del input
            fontSize: "16px", // Cambiar el tamaño de fuente del input
          }),
        }}
*/