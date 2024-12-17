import { useEffect, useState } from "react";
import { useGetItem } from "../../Cajero/Hook/hookItem"; // Hook para obtener pedidos
import { useGetpreci } from "../../Cajero/Hook/GetPrice"; // Hook para obtener precios
import * as XLSX from "xlsx"; // Librería para exportar a Excel
import "./Style/Styleestadistica.css"
interface Product {
  id: number;
  denomination: string;
}

interface ManufacturedProduct {
  id: number;
  denomination: string;
}

interface OrderDetail {
  id: number;
  quantity: number;
  subtotal: number;
  itemProduct?: Product;
  itemManufacturedProduct?: ManufacturedProduct;
}

interface Order {
  id: number;
  dateTime: string | Date;
  orderDetails: OrderDetail[];
}

const Estadisticas = () => {
  const [ingresos, setIngresos] = useState(0);
  const [costos, setCostos] = useState(0);
  const [ganancias, setGanancias] = useState(0);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState<Order[]>([]);

  const getItem = useGetItem();
  const getPrecio = useGetpreci();

  useEffect(() => {
    const fetchData = async () => {
      const pedidos = await getItem(); // Obtenemos los pedidos
      if (pedidos) {
        setPedidos(pedidos);
        setPedidosFiltrados(pedidos);
        calcularTotales(pedidos);
      }
    };
    fetchData();
  }, []);

  const calcularTotales = async (pedidos: Order[]) => {
    let totalIngresos = 0;
    let totalCostos = 0;
    let totalGanancias = 0;

    for (const pedido of pedidos) {
      for (const detalle of pedido.orderDetails) {
        let sellPrice = 0;
        let costPrice = 0;

        if (detalle.itemProduct) {
          const precioProducto = await getPrecio(1, detalle.itemProduct.id);
          if (precioProducto) {
            sellPrice = precioProducto.sellPrice;
            costPrice = precioProducto.costPrice;
          }
        }

        if (detalle.itemManufacturedProduct) {
          const precioProducto = await getPrecio(2, detalle.itemManufacturedProduct.id);
          if (precioProducto) {
            sellPrice = precioProducto.sellPrice;
            costPrice = precioProducto.costPrice;
          }
        }

        totalIngresos += detalle.subtotal;
        totalCostos += costPrice * detalle.quantity;
        totalGanancias += (sellPrice - costPrice) * detalle.quantity;
      }
    }

    setIngresos(totalIngresos);
    setCostos(totalCostos);
    setGanancias(totalGanancias);
  };

  const filtrarPedidosPorFecha = (pedidos: Order[], inicio: Date, fin: Date) => {
    return pedidos.filter((pedido) => {
      const fechaPedido = new Date(pedido.dateTime);
      return fechaPedido >= inicio && fechaPedido <= fin;
    });
  };

  const handleFiltrar = () => {
    if (fechaInicio && fechaFin) {
      const fechaInicioObj = new Date(fechaInicio);
      const fechaFinObj = new Date(fechaFin);

      if (fechaInicioObj > fechaFinObj) {
        alert("La fecha de inicio no puede ser mayor que la fecha de fin.");
        return;
      }

      const pedidosFiltradosPorFecha = filtrarPedidosPorFecha(pedidos, fechaInicioObj, fechaFinObj);
      setPedidosFiltrados(pedidosFiltradosPorFecha);
      calcularTotales(pedidosFiltradosPorFecha);
    } else {
      setPedidosFiltrados(pedidos);
      calcularTotales(pedidos);
    }
  };

  const handleExport = async () => {
    const data = [];
  
    for (const pedido of pedidosFiltrados) {
      for (const detalle of pedido.orderDetails) {
        let sellPrice = 0;
        let costPrice = 0;
  
        if (detalle.itemProduct) {
          const precioProducto = await getPrecio(1, detalle.itemProduct.id);
          if (precioProducto) {
            sellPrice = precioProducto.sellPrice;
            costPrice = precioProducto.costPrice;
          }
        }
  
        if (detalle.itemManufacturedProduct) {
          const precioProducto = await getPrecio(2, detalle.itemManufacturedProduct.id);
          if (precioProducto) {
            sellPrice = precioProducto.sellPrice;
            costPrice = precioProducto.costPrice;
          }
        }
  
        // Convertir la fecha sin ajuste de zona horaria
        const fechaUTC = new Date(pedido.dateTime);
        const fechaFormateada = `${fechaUTC.getUTCFullYear()}-${(fechaUTC.getUTCMonth() + 1)
          .toString()
          .padStart(2, "0")}-${fechaUTC.getUTCDate().toString().padStart(2, "0")}`;
  
        data.push([
          fechaFormateada,
          detalle.itemProduct ? detalle.itemProduct.denomination : detalle.itemManufacturedProduct?.denomination,
          detalle.quantity,
          detalle.subtotal,
          sellPrice,
          costPrice,
          (sellPrice - costPrice) * detalle.quantity,
        ]);
      }
    }
  
    const ws = XLSX.utils.aoa_to_sheet([
      ["Fecha", "Producto", "Cantidad", "Subtotal", "Precio Venta", "Precio Costo", "Ganancia"],
      ...data,
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estadísticas");
  
    XLSX.writeFile(wb, "Estadisticas_Pedidos.xlsx");
  };

  return (
    <div>
      <h2>Ranking de Ganancias y Costos</h2>

      <div>
        <label><strong>Fecha Inicio</strong></label>
        <label style={{marginLeft:"60px"}}><strong>Fecha de Fin</strong></label>
       
        <br/>
        <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="Fechaimputs"/>
        
        <input type="date"  value={fechaFin}  onChange={(e) => setFechaFin(e.target.value)} className="Fechaimputs"/>
        
        <button onClick={handleFiltrar} className="ButtonFilter">Filtrar</button>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
  <div className="Blockingreso">
    <h4 style={{ margin: '0', color: '#6c757d' }}>Ingresos Totales</h4>
    <p style={{ fontSize: '1.5rem', margin: '0', color: '#28a745' }}>${ingresos.toFixed(2)}</p>
  </div>
  <div className="Blockingreso">
    <h4 style={{ margin: '0', color: '#6c757d' }}>Costos Totales</h4>
    <p style={{ fontSize: '1.5rem', margin: '0', color: '#dc3545' }}>${costos.toFixed(2)}</p>
  </div>
  <div className="Blockingreso">
    <h4 style={{ margin: '0', color: '#6c757d' }}>Ganancias Totales</h4>
    <p style={{ fontSize: '1.5rem', margin: '0', color: '#007bff' }}>${ganancias.toFixed(2)}</p>
  </div>
</div>

      <button onClick={handleExport} className="buttonexport">Exportar a Excel</button>
    </div>
  );
};

export default Estadisticas;
