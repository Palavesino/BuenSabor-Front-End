import React, { useEffect, useState } from "react";
import { useGetItem } from "../../Cajero/Hook/hookItem";
import { Bar } from "react-chartjs-2";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend,} from "chart.js";
import "./Style/Styleestadistica.css"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Product {
  id: number;
  denomination: string;
  quantity: number;
}

const ProductRanking: React.FC = () => {
  const getItem = useGetItem();
  const [products, setProducts] = useState<Product[]>([]);
  const [manufacturedProducts, setManufacturedProducts] = useState<Product[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getItem();
        if (data) {
          const { products, manufacturedProducts } = processRanking(data);
          setProducts(products);
          setManufacturedProducts(manufacturedProducts);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  const processRanking = (data: any[]) => {
    const productMap = new Map<number, Product>();
    const manufacturedMap = new Map<number, Product>();

    data.forEach((order) => {
      const orderDate = new Date(order.dateTime);
      if (
        (startDate && orderDate < new Date(startDate)) ||
        (endDate && orderDate > new Date(endDate))
      ) {
        return;
      }

      order.orderDetails.forEach((detail: any) => {
        if (detail.itemProduct) {
          const product = detail.itemProduct;
          if (!productMap.has(product.id)) {
            productMap.set(product.id, { id: product.id, denomination: product.denomination, quantity: 0 });
          }
          productMap.get(product.id)!.quantity += detail.quantity;
        } else if (detail.itemManufacturedProduct) {
          const manufactured = detail.itemManufacturedProduct;
          if (!manufacturedMap.has(manufactured.id)) {
            manufacturedMap.set(manufactured.id, {
              id: manufactured.id,
              denomination: manufactured.denomination,
              quantity: 0,
            });
          }
          manufacturedMap.get(manufactured.id)!.quantity += detail.quantity;
        }
      });
    });

    return {
      products: Array.from(productMap.values()).sort((a, b) => b.quantity - a.quantity),
      manufacturedProducts: Array.from(manufacturedMap.values()).sort((a, b) => b.quantity - a.quantity),
    };
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    const productSheet = XLSX.utils.json_to_sheet(products);
    XLSX.utils.book_append_sheet(workbook, productSheet, "Productos");

    const manufacturedSheet = XLSX.utils.json_to_sheet(manufacturedProducts);
    XLSX.utils.book_append_sheet(workbook, manufacturedSheet, "Productos Manufacturados");

    const excelData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelData], { type: "application/octet-stream" });
    saveAs(blob, "ranking_productos.xlsx");
  };

  const getBarColors = (quantities: number[]): string[] => {
    const maxQuantity = Math.max(...quantities);
    return quantities.map((quantity) => {
      const percentage = quantity / maxQuantity;
      const red = Math.floor(255 * (1 - percentage));
      const green = Math.floor(255 * percentage);
      return `rgba(${red}, ${green}, 0, 0.8)`; // Genera un color del gradiente rojo-verde
    });
  };

  const getChartData = (data: Product[]) => {
    const quantities = data.map((item) => item.quantity);
    return {
      labels: data.map((item) => item.denomination),
      datasets: [
        {
          label: "Cantidad Vendida",
          data: quantities,
          backgroundColor: getBarColors(quantities),
          borderColor: "rgba(0, 0, 0, 0.1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          callback: (value: any) => (Number.isInteger(value) ? value : ""), // Mostrar solo enteros
        },
      },
    },
  };

  return (
    <div>
      <h1>Ranking de Productos</h1>
      <button onClick={exportToExcel} className={"buttonexport"}>Exportar a Excel</button>
      <div>
        <label >
          <strong>Fecha Inicio</strong>
          <br/>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="Fechaimputs"/>
        </label>
        <label style={{marginLeft: "10px"}}>
          <strong>Fecha Fin</strong>
          <br/>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="Fechaimputs" />
        </label>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
            <div style={{ flex: "1", maxWidth: "50%", height: "400px" }}>
              <h2>Productos</h2>
              <Bar data={getChartData(products)} options={chartOptions} />
            </div>
            <div style={{ flex: "1", maxWidth: "50%", height: "400px" }}>
              <h2>Productos Manufacturados</h2>
              <Bar data={getChartData(manufacturedProducts)} options={chartOptions} />
            </div>
          </div>
          <br/>

         
        </>
      )}
    </div>
  );
};

export default ProductRanking;
