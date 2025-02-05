import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSpinner } from "../context/SpinnerContext"; // Importar el SpinnerContext

export const useGenericGet = <T>(
  endpoint: string,
  entidadMsj: string,
  refetch?: boolean
) => {
  const { getAccessTokenSilently } = useAuth0();
  const { showSpinner, hideSpinner } = useSpinner(); // Hook del SpinnerContext

  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    fetchData();
  }, [refetch]);

  const fetchData = async () => {
    showSpinner(); // Mostrar el spinner al iniciar la petición
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${endpoint}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        console.error(`Error fetching ${entidadMsj} data:`, response.status);
      }
    } catch (e) {
      console.error(`Error fetching ${entidadMsj} data:`, e);
    } finally {
      hideSpinner(); // Ocultar el spinner al finalizar la petición, incluso si falla
    }
  };

  return data;
};
