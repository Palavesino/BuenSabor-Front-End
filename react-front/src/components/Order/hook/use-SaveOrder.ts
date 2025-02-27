import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { Order } from "../../../Interfaces/Order";
import { useSpinner } from "../../../context/SpinnerContext";

export const useOrderSave = () => {
    const { getAccessTokenSilently } = useAuth0();
    const { showSpinner, hideSpinner } = useSpinner();
    const orderSave = async (obj: Order) => {
        showSpinner();
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`/api/order/saveComplete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(obj),
            });

            if (!response.ok) {
                throw new Error(`Error al Guardar Orden: ${response.status}`);
            }
            toast.success("😎 Orden Generada Exitosamente!", { position: "top-center" });
            if (obj.paymentType !== 'mp') {
                return null;
            }
            return await response.json();
        } catch (error) {
            toast.error(`No hay Stock para Comprar`, {
                position: "top-center",
            });
            return null;
        } finally {
            hideSpinner();
        }
    };
    return orderSave;
};


