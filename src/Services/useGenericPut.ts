import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";

export const useGenericPut = () => {
  const { getAccessTokenSilently } = useAuth0();

  const genericPut = async <T>(
    endpoint: string,
    id: number,
    obj: T,
    msj: string
  ) => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(`${endpoint}/${id}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(obj),
      });

      console.log(response);
      if (response.ok) {
        toast.success(`${msj}`, {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error(`Ah ocurrido un error` + error, {
        position: "top-center",
      });
    }
  };
  return genericPut;
};
