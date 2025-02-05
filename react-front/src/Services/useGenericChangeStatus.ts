import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { useSpinner } from "../context/SpinnerContext"; // Importar SpinnerContext

export const useGenericChangeStatus = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { showSpinner, hideSpinner } = useSpinner(); // Hook del SpinnerContext

  const updateEntityStatus = async (id: number, endpoint: string) => {
    showSpinner(); // Mostrar el spinner al iniciar la operación
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${endpoint}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success(`😎 Estado Actualizado Exitosamente!`, {
          position: "top-center",
        });
      } else {
        toast.error(`❌ Error al actualizar el estado: ${response.statusText}`, {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error(`❌ Ha ocurrido un error: ${error}`, {
        position: "top-center",
      });
    } finally {
      hideSpinner(); // Ocultar el spinner al finalizar la operación
    }
  };

  return updateEntityStatus;
};
