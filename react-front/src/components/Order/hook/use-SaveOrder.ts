import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { Order } from "../../../Interfaces/Order";


const fetchWithAuth = async (url: string, method: string, token: string, body?: Order) => {
    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    return body ? await response.json() : await response.text();
};


export const useOrderSave = () => {
    const { getAccessTokenSilently } = useAuth0();

    const orderSave = async (obj: Order) => {
        try {
            console.log(JSON.stringify(obj, null, 2));
            let edit = false;
            const token = await getAccessTokenSilently();
            let data;
            if (obj.id !== 0) {
                data = await fetchWithAuth(`/api/order/updateComplete/${obj.id}`, "PUT", token, obj);
                edit = true;
            } else {
                data = await fetchWithAuth(`/api/order/saveComplete`, "POST", token, obj);
            }
            if (obj.paymentType !== "mp") {
                toast.success("😎 Orden Generada Exitosamente!", { position: "top-center" });
                return data;
            }

            return await PostPreference(token, data, edit);
        } catch (error) {
            toast.error(`Ah ocurrido un error al Generar Order` + error, {
                position: "top-center",
            });
        }
    };
    return orderSave;
};


const PostPreference = async (token: string, pedido: Order, edit: boolean) => {
    try {
        let preference = null;
        console.log("Paso 1")
        if (edit) {
            preference = await fetchWithAuth(`/api/payment/preference/order/${pedido.id}`, "GET", token);
            console.log("Tengo la Preferencia = " + preference)
        }
        console.log("Paso 2")
        if (preference !== null) {
            console.log("Paso 4")
            const responseBody = await fetchWithAuth(`/api/payment/preference/update/${preference}`, "PUT", token, pedido);
            toast.success("😎 Orden Editada Exitosamente!", { position: "top-center" });
            console.log("Paso 5")
            return responseBody;
        }
        const responseBody = await fetchWithAuth(`/api/payment/preference/create`, "POST", token, pedido);
        toast.success("😎 Orden Generada Exitosamente!", { position: "top-center" });
        return responseBody;
    } catch (error) {
        console.error("Error creating new Preference:", error);
        toast.error(`Ah ocurrido un error: ${error}`, { position: "top-center" });
    }
};
