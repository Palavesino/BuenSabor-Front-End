import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { useSpinner } from "../../../context/SpinnerContext";

export const useSendEmail = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { showSpinner, hideSpinner } = useSpinner();
  const sendEmail = async (idOrder: number) => {
    showSpinner();
    try {
      const token = await getAccessTokenSilently();
      let response = await fetch(`/api/bill/send/${idOrder}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        console.log("Corre enviado exitosamente")
      }
    } catch (error) {
      toast.error(`Ah ocurrido un error` + error, {
        position: "top-center",
      });
    } finally {
      hideSpinner()
    }
  };
  return sendEmail;
};