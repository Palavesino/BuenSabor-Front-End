import { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component'; 
import { useGetItem } from './Hook/hookItem';
import { Order } from '../../Interfaces/Order';
import { conditionalRowStyles, customStyles, customImputs, customComboBox, StyleTable } from './Style/RowStile';
import  './Style/TablaStyle.css';
import { updateOrderState } from './Hook/UpdateOrderState';
import { OrderStatus } from '../Enum/OrderStatus';
import BootstrapModal from './ModalOrderDetails'; 

const statusOptions = [
  { value: "PENDING", label: 'A confirmar' },
  { value: "PREPARATION", label: 'En cocina' },
  { value: "READY", label: 'Listo' },
  { value: "DELIVERED", label: 'En delivery' },
  { value: "FINALIZED", label: 'Entregado' },
  { value: "REJECTED", label: 'Rechazado' },
  { value: "CANCELED", label: 'Cancelado' }
];

const Cajero = () => {
  const [filterText, setFilterText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const [showModal, setShowModal] = useState(false);  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);  
  const getItem = useGetItem();
  const update = updateOrderState();

  const fetchPedidos = async () => {
    const data = await getItem();
    if (data) {
      setPedidos(data.map((pedido: any) => ({
        id: pedido.id,
        address: pedido.address,
        apartment: pedido.apartment,
        dateTime: new Date(pedido.dateTime),
        deliveryMethod: pedido.deliveryMethod,
        discount: pedido.discount,
        estimatedTime: pedido.estimatedTime,
        paid: pedido.paid,
        paymentType: pedido.paymentType,
        phone: pedido.phone,
        state: pedido.state,
        total: pedido.total,
        userId: pedido.userId,
        userName: pedido.userName,
        userLastName: pedido.userLastName,
        orderDetails: pedido.orderDetails 
      })));
    }
  };

  const onStateUpdate = async (id: number, newState: OrderStatus) => {
    try {
      await update(newState, id);
      setPedidos((prev) =>
        prev.map((pedido) =>
          pedido.id === id ? { ...pedido, state: newState } : pedido
        )
      );
    } catch (error) {
      alert('Error al actualizar el estado del pedido');
    }
  };

  const renderButtons = (row: Order) => {
    switch (row.state) {
      case 'PENDING':
        return (row.estimatedTime === '0' || !row.estimatedTime || row.estimatedTime === "00:00:00.000000" || row.estimatedTime === "00:00:00") && row.deliveryMethod === 'local' ? (

            <button className="buttonEntregar" onClick={() => onStateUpdate(row.id, OrderStatus.FINALIZED)}> Entregar</button>

        ) : (row.estimatedTime !== '0' && row.estimatedTime !== '' && row.estimatedTime !== "00:00:00" && row.estimatedTime !== "00:00:00.000000") ? (
          
            <button className="buttonCocina" onClick={() => onStateUpdate(row.id, OrderStatus.PREPARATION)}> Mandar a cocina</button>
        
        ) : <button className="buttonDelivery" onClick={() => onStateUpdate(row.id, OrderStatus.DELIVERED)}> Mandar a Delivery</button>;

      case 'READY':
        return row.deliveryMethod === 'local' ? (

          <button className="buttonEntregar" onClick={() => onStateUpdate(row.id, OrderStatus.FINALIZED)}> Entregar </button>
       
        ) : <button className="buttonDelivery" onClick={() => onStateUpdate(row.id, OrderStatus.DELIVERED)}> Mandar a Delivery </button>;
      
      default:
       return null;
    }
  };

  const columns: TableColumn<Order>[] = [
    { name: 'ID', selector: (row: any) => row.id, sortable: true, width: '70px' },
    { name: 'Cliente', selector: row => (row.userName + " " + row.userLastName), sortable: true, width: '180px' },
    { name: 'Método del pedido', selector: row => row.deliveryMethod, sortable: true, width: '160px' },
    { name: 'Tipo de pago', selector: row => row.paymentType, sortable: true, width: '160px' },
    { name: 'Fecha del pedido', selector: row => formatDate(row.dateTime), sortable: true, width: '160px' },
    { name: 'Con Descuento', selector: row => row.discount, sortable: true, width: '150px' },
    { name: 'Total', selector: row => row.total, sortable: true, width: '100px' },
    { name: 'Estado', selector: row => statusOptions.find(option => option.value === row.state)?.label || '', sortable: true, width: '150px' },
    { 
      name: 'Ver productos', 
      cell: (row) => (
        <button 
          className="buttonProductos"
          onClick={() => { 
            setSelectedOrder(row); 
            setShowModal(true); 
          }}
        >
          Ver productos 
        </button>
      ), 
      width: '150px',
    },
    { 
      name: 'Acciones para estado', 
      cell: (row) => renderButtons(row), 
      minWidth: '180px',
    }
  ];

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const closeModal = () => setShowModal(false);

  useEffect(() => {
    fetchPedidos();
  }, []);

  return (
  <div>
      <div className="d-flex mb-3">
        <input
          type="text"
          placeholder="Buscar por ID..."
          
          style={customImputs}
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <select
          style={customComboBox}
          value={selectedStatus || ''}
          onChange={(e) => setSelectedStatus(e.target.value || null)}
        >
          <option value="">No filtrar por estado</option>
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div style={StyleTable}>
      <DataTable
        columns={columns}
        data={pedidos.filter(pedido =>
          pedido.id.toString().includes(filterText) && 
          (selectedStatus ? pedido.state === selectedStatus : true)
        )}
        customStyles={customStyles}
        conditionalRowStyles={conditionalRowStyles}
        pointerOnHover
        responsive
        noDataComponent={null}
      />

      {/* Modal de react-bootstrap desde el componente externo */}
      <BootstrapModal
        orderDetails={selectedOrder?.orderDetails || []}
        show={showModal}
        handleClose={closeModal}
      />
    </div>
  </div>
  );
};

export default Cajero;
