import { ModalType } from "../Enum/ModalType";
import { Button,Modal } from "react-bootstrap";
import { OrderStatus } from "../Enum/OrderStatus";
import { useGenericChangeStatus } from "../../Services/useGenericChangeStatus";

interface CancelModalProps {
    show: boolean; // Indica si el modal debe mostrarse o no
    onHide: () => void; // Función que se ejecuta cuando el modal se cierra
    modalType: ModalType; // Tipo de modal, indica si es para editar, crear o cambiar el estado de una Orden
    state: OrderStatus; // Estado actual del Orden
   // order : Order;
   idOrder:number;
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>; // Función para actualizar el estado y volver a obtener los datos después de realizar una acción en el modal
  }

const CancelModal : React.FC<CancelModalProps> = ({
    show,
    onHide,
    modalType,
    state,
    idOrder,
    setRefetch
  }) => {
    const cancelOrderStatus = useGenericChangeStatus(); 
     // Maneja el cambio de estado de una Orden
  const handleStateOrder = async () => {
      await cancelOrderStatus(idOrder, "/api/order/cancel");
    setRefetch(true);
    onHide();
  };
  return (
   <>
   {modalType === ModalType.Cancel &&
        state === OrderStatus.PENDING && (
          <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
              <Modal.Title>Cancelar Orden</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                ¿Está seguro que desea Cancelar La Orden Pendiente? 
                <br /> <strong>Order id = {idOrder}</strong>?
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                Cancelar
              </Button>
              <Button
                variant={state ? "success" : "danger"}
                onClick={handleStateOrder}
              >
                Guardar
              </Button>
            </Modal.Footer>
          </Modal>
        )}
   </>
  )
}
export default CancelModal