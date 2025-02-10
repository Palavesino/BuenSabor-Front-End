import { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useGetItem } from './Hook/hookItem';
import { Order } from '../../Interfaces/Order';
import { conditionalRowStyles, customStyles, customImputs, StyleTable } from './Style/RowStile';
import  './Style/TablaStyle.css';
import { updateOrderState } from './Hook/UpdateOrderState';
import { OrderStatus } from '../Enum/OrderStatus';
import BootstrapModal from './ModalOrderDetails'; 


const Delivery = () => {
  const [filterText, setFilterText] = useState('');
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const [showModal, setShowModal] = useState(false);  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);  
  const getItem = useGetItem();
  const updateSate = updateOrderState();

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
      await updateSate(newState, id);
      setPedidos((prev) =>
        prev.map((pedido) =>
          pedido.id === id ? { ...pedido, state: newState } : pedido
        )
      );
    } catch (error) {
      alert('Error al actualizar el estado del pedido');
    }
  };

  const columns: TableColumn<Order>[] = [
    { name: 'ID', selector: (row: any) => row.id, sortable: true, width: '180px' },
    { name: 'Cliente', selector: row => (row.userName + " " + row.userLastName), sortable: true, width: '180px' },
    { name: 'Direccion', selector: row => row.address, sortable: true, width: '180px' },
    { name: 'departamento', selector: row => row.apartment, sortable: true, width: '180px' },
    
    { name: 'Telefono', selector: row => row.phone, sortable: true, width: '180px' },
    { name: 'Forma de pago', selector: row => row.paymentType, sortable: true, width: '180px' },
    { 
      name: 'Ver productos', 
      cell: (row) => (
        <button  className="buttonProductos" 
          onClick={() => { setSelectedOrder(row); setShowModal(true);  }}>
          Ver productos
        </button>
      ),
      width: '180px' 
    },
    { 
      name: 'Acciones para estado', 
      cell: (row) => (<button className="buttonEntregar" onClick={() => onStateUpdate(row.id, OrderStatus.FINALIZED)}> Entregar </button>), 
      minWidth: '180px' 
    }
  ];


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
    </div>
      <div style={StyleTable}>
      <DataTable
        columns={columns}
        data={pedidos
          .filter(pedido =>pedido.id.toString().includes(filterText))
          .filter((pedido) => pedido.state === "DELIVERED")
        }
        customStyles={customStyles}
        conditionalRowStyles={conditionalRowStyles}
        pointerOnHover
        responsive
        noDataComponent={null}
      />
      <BootstrapModal
        orderDetails={selectedOrder?.orderDetails || []}
        show={showModal}
        handleClose={closeModal}
      />
    </div>
  </div>
  );
};

export default Delivery;
