import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";

export const useValidate = () => {
    // Obtiene las funciones necesarias de Auth0 React SDK
    const { getAccessTokenSilently } = useAuth0();

    // Define la función rolePost que realiza una petición POST para asignar un rol a un usuario
    const validate = async (id: number | string, type: string) => {
        try {

            // Obtiene el token de acceso de forma silenciosa utilizando Auth0
            const token = await getAccessTokenSilently();
            const response = await fetch(`/api/stock/verifAndDisableByStock/${id}/${type}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            // Verifica si la respuesta de la API es exitosa
            if (response.ok) {
                const data = response.json()
                return data;
            }
        } catch (error) {
            // Captura y maneja cualquier error que pueda ocurrir durante la asignación del rol
            console.error("Error ", error);
            toast.error(`Ah ocurrido un error` + error, {
                position: "top-center",
            });
        }
    };
    return validate;
};
