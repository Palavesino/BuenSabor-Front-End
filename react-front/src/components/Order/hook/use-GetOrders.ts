import { toast } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react";
import { Order } from "../../../Interfaces/Order";
import { useSpinner } from "../../../context/SpinnerContext";

export const useGetOrders = () => {
    const { getAccessTokenSilently } = useAuth0();
    const { showSpinner, hideSpinner } = useSpinner();
    const getOrders = async (id: number): Promise<Order[] | null> => {
        showSpinner()
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`/api/order/all/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error al obtener órdenes: ${response.status}`);
            }

            const data: Order[] = await response.json(); // ✅ Convertir a JSON
            return data;
        } catch (error) {
            toast.error(`Ha ocurrido un error: ${error}`, {
                position: "top-center",
            });
            return null; // ✅ Manejo de errores más seguro
        } finally {
            hideSpinner();
        }
    };

    return getOrders;
};
