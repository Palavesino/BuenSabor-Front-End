import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { Order } from "../../../Interfaces/Order";
import { useSpinner } from "../../../context/SpinnerContext";
import { OrderDetail } from "../../../Interfaces/OrderDetail";

export const useValidateStock = () => {
    const { getAccessTokenSilently } = useAuth0();
    const { showSpinner, hideSpinner } = useSpinner();
    const validateStock = async (obj: OrderDetail[]) => {
        showSpinner();
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`/api/stock/verifActualStockAndQuantity`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(obj),
            });

            if (!response.ok) {
                throw new Error(`Error al Guardar Orden: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            toast.error(`Ha ocurrido un error: ${error}`, {
                position: "top-center",
            });
            return null;
        } finally {
            hideSpinner();
        }
    };
    return validateStock;
};


