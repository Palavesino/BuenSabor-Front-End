import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { useSpinner } from "../context/SpinnerContext";
export const useGenericPut = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { showSpinner, hideSpinner } = useSpinner();

  const genericPut = async <T>(endpoint: string, id: number, obj: T) => {
    showSpinner();
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(`${endpoint}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(obj),
      });

      if (response.ok) {
        toast.success(`😎 Editado Exitosamente!`, {
          position: "top-center",
        });
      } else {
        console.error("Error updating entity:", response.status);
      }
    } catch (error) {
      toast.error(`Ha ocurrido un error: ${error}`, {
        position: "top-center",
      });
    } finally {
      hideSpinner();
    }
  };

  return genericPut;
};
