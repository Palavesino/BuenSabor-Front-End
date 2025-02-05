// Importaciones de componentes, funciones y modelos
import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import GenericTable from "../Generic/GenericTable";
import { Order } from "../../Interfaces/Order";
import { ModalType } from "../Enum/ModalType";
import { usePermission } from "../../context/PermissionContext";
import CancelModal from "./CancelModal";
import { OrderStatus } from "../Enum/OrderStatus";
import ShowBill from "../Bill/ShowBill";
import { useGetOrders } from "./hook/use-GetOrders";


/*
el componente OrderUserTable se encarga de mostrar una tabla de Ordenes del Usuario, 
permitiendo editar y ver  ordenes.
*/


const OrderUserTable = () => {

    // Estado del modal
    const [showModal, setShowModal] = useState(false);
    // Estado para el tipo de modal
    const [modalType, setModalType] = useState<ModalType>(ModalType.None);
    const { userComplete } = usePermission();
    const getUserOrders = useGetOrders();
    // Estado para indicar si es necesario refrescar los datos
    const [refetch, setRefetch] = useState(false);
    // Estado para almacenar  ordenes
    const [orders, setOrders] = useState<Order[]>([]);
    const [idOrder, setIdOrder] = useState(0);
    const [state, setState] = useState<OrderStatus>(OrderStatus.PENDING);

    useEffect(() => {
        if (userComplete) {
            const fetchData = async () => {
                const data = await getUserOrders(userComplete.id);
                if (data) {
                    setOrders(data);
                }
                setRefetch(false);
            };

            fetchData();
        }
    }, [userComplete, refetch]);

    const handleClick = (
        o: Order,
        modal: ModalType
    ) => {
        setState(o.state);
        setIdOrder(o.id);
        setModalType(modal);
        setShowModal(true);
    };

    const handleCancel = (o: Order) => {
        handleClick(o, ModalType.Cancel);
    };
    const handleView = (o: Order) => {
        handleClick(o, ModalType.View);
    }
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
                            view: true,
                            cancel: true,
                        }}
                        onCancel={handleCancel}
                        onView={handleView}
                    />
                </Col>
                {(showModal && modalType === ModalType.Cancel) && (
                    <CancelModal
                        state={state}
                        idOrder={idOrder}
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        setRefetch={setRefetch}
                        modalType={modalType}
                    />
                )}
                {(showModal && modalType === ModalType.View) && (
                    <ShowBill
                        onHide={() => setShowModal(false)}
                        orderId={idOrder}
                        show={showModal}
                    />
                )}
            </Row>
        </>
    );
};
export default OrderUserTable;
