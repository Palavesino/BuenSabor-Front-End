import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";

export const useSendEmail = () => {
  const { getAccessTokenSilently } = useAuth0();
  const sendEmail = async (idOrder: number) => {
    try {
      console.log("enviando email a " + idOrder)
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
    } 
  };
  return sendEmail;
};