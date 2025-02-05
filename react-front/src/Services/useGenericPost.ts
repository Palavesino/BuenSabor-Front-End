import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { useSpinner } from "../context/SpinnerContext";

export const useGenericPost = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { showSpinner, hideSpinner } = useSpinner(); 

  const genericPost = async <T>(endpoint: string, obj?: T) => {
    showSpinner();
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(`${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(obj),
      });

      if (response.ok) {
        toast.success(`😎 Insertado Exitosamente!`, {
          position: "top-center",
        });
      } else {
        toast.error(`❌ Error al insertar: ${response.statusText}`, {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error(`❌ Ha ocurrido un error: ${error}`, {
        position: "top-center",
      });
    } finally {
      hideSpinner(); 
    }
  };

  return genericPost;
};
