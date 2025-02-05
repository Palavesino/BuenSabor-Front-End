import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { useSpinner } from "../../../../context/SpinnerContext";
/**
 Este hook proporciona una función (statusPut) que realiza una solicitud PATCH a una API 
 para actualizar el estado de bloqueo de un usuario específico utilizando el 
 token de acceso obtenido de Auth0. 
 */
export const useStatusPut = () => {
    // Obtiene las funciones necesarias de Auth0 React SDK
    const { getAccessTokenSilently } = useAuth0();
    const { showSpinner, hideSpinner } = useSpinner();
    // Función que realiza una petición PATCH para actualizar el estado de bloqueo de un usuario
    const statusPut = async (status: boolean, userAuth0Id: string) => {
        showSpinner();
        try {
            // Codifica el ID del usuario para incluirlo en la URL
            const encodedUserId = encodeURIComponent(userAuth0Id).replaceAll("|", "%7C");

            // Obtiene el token de acceso de forma silenciosa utilizando Auth0
            const token = await getAccessTokenSilently();

            // Cuerpo de la solicitud PATCH con el nuevo estado de bloqueo
            const requestBody = { blocked: status };
            let url = status ? '/api/users/block/' + encodedUserId : '/api/users/unlock/' + encodedUserId;

            // Realiza la petición PATCH a la API para actualizar el estado de bloqueo del usuario


            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            // Verifica si la respuesta es exitosa
            if (response.ok) {
                // Muestra un mensaje de éxito si la respuesta es exitosa
                toast.success(`😎 Estado Editado Exitosamente!`, {
                    position: "top-center",
                });
            }
        } catch (error) {
            // Captura y maneja cualquier error que pueda ocurrir durante la actualización del estado
            console.error("Error updating user status:", error);
            toast.error(`Ah ocurrido un error` + error, {
                position: "top-center",
            });
            // Retorna null en caso de error
            return null;
        } finally {
            hideSpinner(); // Ocultar el spinner después de la solicitud
        }
    };
    return statusPut;
};

