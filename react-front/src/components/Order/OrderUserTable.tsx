// Importaciones de componentes, funciones y modelos
import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import GenericTable from "../Generic/GenericTable";
import { Order } from "../../Interfaces/Order";
import { ModalType } from "../Enum/ModalType";
import { useGenericGet } from "../../Services/useGenericGet";
import { usePermission } from "../../context/PermissionContext";
import { useCart } from "../../context/CartContext";
import { useNavigate } from 'react-router-dom';
import CancelModal from "./CancelModal";
import { OrderStatus } from "../Enum/OrderStatus";


/*
el componente OrderUserTable se encarga de mostrar una tabla de Ordenes del Usuario, 
permitiendo editar y ver  ordenes.
*/


const OrderUserTable = () => {

    // Estado del modal
    const [showModal, setShowModal] = useState(false);
    // Estado para el tipo de modal
    const [modalType, setModalType] = useState<ModalType>(ModalType.None);
    const { setCart } = useCart();
    const navigate = useNavigate();
    const { userComplete } = usePermission();
    // Estado para indicar si es necesario refrescar los datos
    const [refetch, setRefetch] = useState(false);
    // Estado para almacenar  ordenes
    const [orders, setOrders] = useState<Order[]>([]);
    const [idOrder, setIdOrder] = useState(0);
    const [state, setState] = useState<OrderStatus>(OrderStatus.PENDING);

    // Obtener datos de las ordenes del usuario, utilizando el hook useGenericGet
    const data = useGenericGet<Order>(
        `/api/order/all/${userComplete?.id}`,
        "User Orders",
        refetch
    );

    useEffect(() => {
        // Actualizar los ordenes del usuario cuando se obtiene nueva data
        setOrders(data);
        setRefetch(false);
    }, [data, userComplete]);

    const handleClick = (
        o: Order,
        modal: ModalType
    ) => {
        setState(o.state);
        setIdOrder(o.id);
        setModalType(modal);
        setShowModal(true);
    };

    const handleEdit = (o: Order) => {
        setCart(o.orderDetails);
        navigate(`/private/carrito/${o.id}`);
    };
    const handleCancel = (o: Order) => {
        handleClick(o, ModalType.Cancel);
    };
    // Renderizado del componente
    return (
        <>
            <Row style={{ width: "100%" }}>
                <Col >
                    <GenericTable
                        data={orders}
                        columns={[
                            // Definir las columnas de la tabla
                            { field: "id", title: "Id", width: 1 },
                            { field: "state", title: "Estado", width: 1 },
                            { field: "total", title: "Total", width: 1.3 },
                            { field: "paid", title: "Pago", width: 1 },
                            { field: "paymentType", title: "Tipo de Pago", width: 1 },
                        ]}
                        actions={{
                            width: 0.5,
                            update: true,
                            view: true,
                            cancel: true,
                        }}
                        onUpdate={handleEdit}
                        onCancel={handleCancel}
                    />
                </Col>
                {showModal && (
                    <CancelModal
                        state={state}
                        idOrder={idOrder}
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        setRefetch={setRefetch}
                        modalType={modalType}
                    />
                )}
            </Row>
        </>
    );
};
export default OrderUserTable;
