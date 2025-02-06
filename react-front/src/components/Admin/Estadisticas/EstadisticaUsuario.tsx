import React, { useState, useEffect } from "react";
import { useGetItem } from "../../Cajero/Hook/hookItem";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Bar } from "react-chartjs-2";
import DataTable from "react-data-table-component";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { OrderDetail } from "../../../Interfaces/OrderDetail";
import { Modal } from "react-bootstrap"; 
import  {customStyles} from "./Style/EstadisticaUsuStyle";
import "./Style/Styleestadistica.css"

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

interface ClientData {
  id: number;
  name: string;
  lastName: string;
  totalOrders: number;
  totalAmount: number;
  orders: Order[];
}

interface Order {
  id: number;
  dateTime: string;
  total: number;
  orderDetails: OrderDetail[];
}

const EstadisticaUsuario: React.FC = () => {
  const getItem = useGetItem();
  const [clients, setClients] = useState<ClientData[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"orders" | "amount">("amount");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);

  const handleShowModal = (client: ClientData) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    //Llamo y traigo todos los datos de los pedidos
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getItem();
        if (data) {
          const processedData = processClientData(data);
          setClients(processedData);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [startDate, endDate, sortBy]);

  const processClientData = (data: any[]): ClientData[] => {
    const clientMap = new Map<number, ClientData>();

    data.forEach((order) => {
      const orderDate = new Date(order.dateTime);
      if (
        (startDate && orderDate < new Date(startDate)) ||
        (endDate && orderDate > new Date(endDate))
      ) {
        return;
      }

      const clientId = order.userId;
      if (!clientMap.has(clientId)) {
        clientMap.set(clientId, {
          id: clientId,
          name: order.userName,
          lastName: order.userLastName,
          totalOrders: 0,
          totalAmount: 0,
          orders: [],
        });
      }

      const clientData = clientMap.get(clientId)!;
      clientData.totalOrders += 1;
      clientData.totalAmount += order.total;
      clientData.orders.push({
        id: order.id,
        dateTime: order.dateTime,
        total: order.total,
        orderDetails: order.orderDetails,
      });
    });

    return Array.from(clientMap.values()).sort((a, b) =>
      sortBy === "orders"
        ? b.totalOrders - a.totalOrders
        : b.totalAmount - a.totalAmount
    );
  };

  //exportar los datos a un excel 
  const exportToExcel = () => {

    const workbook = XLSX.utils.book_new();

    const clientSheet = XLSX.utils.json_to_sheet(
      clients.map((client) => ({
        Cliente: `${client.name} ${client.lastName}`,
        "Cantidad de Pedidos": client.totalOrders,
        "Importe Total": client.totalAmount.toFixed(2),
      }))
    );
    XLSX.utils.book_append_sheet(workbook, clientSheet, "Clientes");

    const excelData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelData], { type: "application/octet-stream" });
    saveAs(blob, "clientes_pedidos.xlsx");
  };

  // Ordenar los clientes explícitamente para el gráfico
  const sortedClients = [...clients].sort((a, b) =>
    sortBy === "orders"
      ? b.totalOrders - a.totalOrders
      : b.totalAmount - a.totalAmount
  );

  const chartData = {
    labels: sortedClients.map((client) => `${client.name} ${client.lastName}`),
    datasets: [
      {
        label: "Cantidad de Pedidos",
        data: sortedClients.map((client) => client.totalOrders),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Importe Total",
        data: sortedClients.map((client) => client.totalAmount),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const columns = [
    {
      name: "Cliente",
      selector: (row: ClientData) => `${row.name} ${row.lastName}`,
      sortable: true,
    },
    {
      name: "Cantidad de Pedidos",
      selector: (row: ClientData) => row.totalOrders,
      sortable: true,
    },
    {
      name: "Importe Total",
      selector: (row: ClientData) => `$${row.totalAmount.toFixed(2)}`,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row: ClientData) => (
        <button onClick={() => handleShowModal(row)} className="Vpedido">Ver Pedidos</button>
      ),
    },
  ];

  return (
    <div>
      <h1>Ranking de Clientes y Pedidos</h1>
      <button onClick={exportToExcel} className="buttonexport">Exportar a Excel</button>
      
      <div>
        <label>
          <strong>Fecha Inicio</strong>
          <br/>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="Fechaimputs"/>
        </label>
        <label style={{marginLeft: "10px"}}>
          <strong>Fecha Fin</strong>
          <br/>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="Fechaimputs"/>
        </label>
        <label style={{marginLeft: "10px"}}>
          <strong>Ordenar por</strong>
          <br/>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "orders" | "amount")} className="rounded-select">
            <option className="custom-option" value="orders">Cantidad de Pedidos</option>
            <option className="custom-option" value="amount">Importe Total</option>
          </select>
        </label>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ flex: 1, maxWidth: "50%" ,marginRight: "50px" }}>
            <Bar data={chartData} options={{ responsive: true }} />
          </div>
          <div style={{ flex: 1 ,  maxWidth: "50%"}}>
            <DataTable
              customStyles={customStyles}
              columns={columns}
              data={clients}
              pagination
              highlightOnHover
              responsive
             
            />
           
          </div>
        </div>
      )}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header style={{background: 'linear-gradient(150deg,  #f6bd5a, black)', color: 'white'}}>
          <Modal.Title>
            Pedidos del cliente {selectedClient?.name} {selectedClient?.lastName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedClient?.orders.length ? (
            <div>
              {selectedClient.orders.map((order) => (
                <div key={order.id}>
                  <h6>
                    <strong>ID:</strong> {order.id}
                  </h6>
                  <h6>
                    <strong>Fecha:</strong>{" "}
                    {new Date(order.dateTime).toLocaleDateString()}
                  </h6>
                  <h6>
                    <strong>Total:</strong> ${order.total.toFixed(2)}
                  </h6>
                  <hr />
                </div>
              ))}
            </div>
          ) : (
            <p>No se han encontrado pedidos.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EstadisticaUsuario;
