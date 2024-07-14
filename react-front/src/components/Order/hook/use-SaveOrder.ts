import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { Order } from "../../../Interfaces/Order";


const fetchWithAuth = async (url: string, method: string, token: string, body: Order) => {
    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    };
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
};


export const useOrderSave = () => {
    const { getAccessTokenSilently } = useAuth0();

    const orderSave = async (obj: Order) => {
        try {
            const token = await getAccessTokenSilently();
            const data = await fetchWithAuth(`/api/order/saveComplete`, "POST", token, obj);

            if (obj.paymentType !== "mp") {
                toast.success("😎 Orden Generada Exitosamente!", { position: "top-center" });
                return data;
            }

            return await PostPreference(token, data);
        } catch (error) {
            toast.error(`Ah ocurrido un error al Generar Order` + error, {
                position: "top-center",
            });
        }
    };
    return orderSave;
};


const PostPreference = async (token: string, pedido: Order) => {
    try {
        const responseBody = await fetchWithAuth(`/api/payment/preference/create`, "POST", token, pedido);
        toast.success("😎 Orden Generada Exitosamente!", { position: "top-center" });
        return responseBody;
    } catch (error) {
        console.error("Error creating new Preference:", error);
        toast.error(`Ah ocurrido un error: ${error}`, { position: "top-center" });
    }
};
