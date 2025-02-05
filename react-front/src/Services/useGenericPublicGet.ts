import { useEffect, useState } from "react";
import { useSpinner } from "../context/SpinnerContext"; // Importar SpinnerContext

export const useGenericPublicGet = <T>(
  endpoint: string,
  entidadMsj: string,
  refetch?: boolean
) => {
  const [data, setData] = useState<T[]>([]);
  const { showSpinner, hideSpinner } = useSpinner();

  useEffect(() => {
    fetchData();
  }, [refetch]);

  const fetchData = async () => {
    showSpinner();
    try {
      const response = await fetch(`${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
      hideSpinner();
    }
  };

  return data;
};
