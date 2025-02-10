import React from "react";
import EstadisticasProductos from "./EstadisticaProduct";
import EstadisticaUsuario from "./EstadisticaUsuario";
import EstadisticaIngreso from "./EstadisticaIngreso";

const DashboardEstadisticas: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <div> 
        <div>
          <EstadisticasProductos />
        </div>
     <br/>
        <div style={{marginTop:"10px"}}>
          <EstadisticaUsuario />
        </div>
     <br/>
        <div style={{marginTop:"10px"}}>
          <EstadisticaIngreso />
        </div>
      </div>
    </div>
  );
};

export default DashboardEstadisticas;
