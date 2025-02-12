import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { useSpinner } from "../../../context/SpinnerContext";

export const useCancelOrder = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { showSpinner, hideSpinner } = useSpinner();
  const cancelOrder = async (id: number, endpoint: string) => {
    showSpinner
    try {
      const token = await getAccessTokenSilently();
      let response = await fetch(`${endpoint}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        toast.success(`😎 Estado Actualizado Exitosamente!`, {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error(`Ah ocurrido un error` + error, {
        position: "top-center",
      });
    } finally {
      hideSpinner();
    }
  };
  return cancelOrder;
};
