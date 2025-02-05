import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { ItemPaymentMarketDTO } from "../../../../Interfaces/ItemPaymentMarket";
/**
 Este hook proporciona una función (putPaid) que realiza una solicitud PUT a una API 
 para actualizar el estado de Pago de una Orden específico utilizando el 
 token de acceso obtenido de Auth0. 
 */
export const usePutPaid = () => {
    // Obtiene las funciones necesarias de Auth0 React SDK
    const { getAccessTokenSilently } = useAuth0();

    // Función que realiza una petición Put para actualizar el Pago de una Orden.
    const putPaid = async (payment_id: number, preferenceId: string, status: string) => {
        try {
            const requestBody: ItemPaymentMarketDTO = ({
                id: 0,
                preferenceId: preferenceId,
                paymentID: payment_id,
                status: status
            }
            );

            // Obtiene el token de acceso de forma silenciosa utilizando Auth0
            const token = await getAccessTokenSilently();
            await fetch("/api/payment/paid/order", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

        } catch (error) {
            console.error("Error updating paid status:", error);
            toast.error(`Ah ocurrido un error` + error, {
                position: "top-center",
            });
            return null;
        }
    };
    return putPaid;
};