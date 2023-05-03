import React, { useRef, FormEvent, useState } from "react";
import { Form, Button } from "react-bootstrap";
import Rubro from "../Model/Rubro";

interface Props {
  onSubmit: (values: { nombre: string; estado: boolean }) => void;
  rubro: any;
  setRubro: (rubro: any) => void;
}

const FormularioRubro = ({ onSubmit, rubro, setRubro: setRubro }: Props) => {
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState(false);

  const handleNombreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (rubro) {
      const newRubro = { ...rubro, nombre: event.target.value };
      setRubro(newRubro);
    } else {
      setNombre(event.target.value);
    }
  };

  const handleCompletadoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.checked;
    rubro ? setRubro({ ...rubro, completado: value }) : setEstado(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    {
      rubro
        ? onSubmit({ nombre: rubro.nombre, estado: !!rubro.estado })
        : onSubmit({ nombre, estado: estado });
    }
    setNombre("");
    setEstado(false);
    setRubro(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{rubro ? "Editar" : "Nueva Tarea"}</h3>
      <div>
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          value={rubro ? rubro.nombre : nombre}
          onChange={handleNombreChange}
        />
      </div>
      <div>
        <input
          type="checkbox"
          id="estado"
          checked={rubro ? rubro.completado : estado}
          onChange={handleCompletadoChange}
        />
        <label htmlFor="estado">Estado</label>
      </div>
      <button type="submit">
        {rubro ? "Guardar cambios" : "Agregar tarea"}
      </button>
      {rubro && (
        <button type="button" onClick={() => setRubro(null)}>
          Cancelar
        </button>
      )}
    </form>
  );
};

export default FormularioRubro;
