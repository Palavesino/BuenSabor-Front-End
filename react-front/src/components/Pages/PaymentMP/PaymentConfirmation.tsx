import { useLocation } from "react-router-dom";
import "./PaymentConfirmation.css";
import { Alert, Button, Card } from "react-bootstrap";
import queryString from "query-string";
import { PaymentStatus } from "../../Enum/Paid";
import { usePutPaid } from "./hook/use-PutPaid";
import { useEffect } from "react";



const PaymentConfirmation = () => {
    const location = useLocation();
    const updatePaidStatus = usePutPaid();
    const queryParams = queryString.parse(location.search);
    const { payment_id, status, preference_id } = queryParams;


    useEffect(() => {
        if (status !== null) {
            const fetchPaid = async () => {
                await updatePaidStatus(Number(payment_id), String(preference_id), String(status));
            };

            fetchPaid();
        }
    }, [status]);

    let variant = '';
    let title = "";

    // Lógica para determinar la variante de la alerta según el estado del pago
    switch (status) {
        case PaymentStatus.APPROVED:
            variant = 'success';
            title = "Aprobado";
            break;
        case PaymentStatus.REJECT:
            variant = 'danger';
            title = "Fallido intente Nuevamente";
            break;
        case PaymentStatus.IN_PROCESS:
            variant = 'warning';
            title = "En Proceso";
            break;
        default:
            variant = 'info';
            title = "Cancelado";
            break;
    }

    // Resto de tu código de componente...
    return (
        <>
            <div className="conteiner-statusPayment-Card">
                <Card className='statusPayment-Card'>
                    <Card.Body>
                        <Alert variant={variant} className="alert-statusPayment-Card">
                            {`El Estado de Pago de su pedido =  ${title}`}
                        </Alert>
                    </Card.Body>
                    <Card.Footer>
                        <Button href="/" className="button-card">
                            Volver al Menu
                        </Button>
                        {status != PaymentStatus.APPROVED
                            ? (
                                <Button className="button-right button-card">
                                    Carrito
                                </Button>
                            )
                            : (
                                <Button className="button-right button-card" href="/private/user/orders">
                                    Historial
                                </Button>
                            )
                        }

                    </Card.Footer>
                </Card>
            </div>
        </>
    )
}
export default PaymentConfirmation