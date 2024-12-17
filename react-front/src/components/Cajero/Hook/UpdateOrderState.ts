import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
  
  export const updateOrderState = () => {
    const { getAccessTokenSilently } = useAuth0();
  
    const orderState = async (newState: string, id: number ) => {
      try {
        const token = await getAccessTokenSilently();
  
        const response = await fetch(`/api/order/updateState`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({id , newState}),
        });
  
        if (response.ok) {
          toast.success(`😎 Modificado Exitosamente!`, {
            position: "top-center",
          });
          const data= response.json();
          return data;
        }
      } catch (error) {
        toast.error(`Ah ocurrido un error` + error, {
          position: "top-center",
        });
        return null;
      }
    };
    return orderState;
  };