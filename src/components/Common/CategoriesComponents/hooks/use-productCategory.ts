import { useEffect, useState } from "react";
//import { useAuth0 } from "@auth0/auth0-react";
import { Rubro } from "../../../Model/Interfaces";

/**
 * Hook personalizado para obtener la lista de useCategoryProduct (Simple).
 * @param termino Término de búsqueda opcional.
 * @returns Un objeto que contiene la lista de useCategoryProduct.
 */
export const useCategoryProduct = (termino: string = "all") => {
  const [rubros, setRubros] = useState<Rubro[]>([]);
  // const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getAllProductCategory();
  }, [termino]);

  const getAllProductCategory = async () => {
    try {
      //const token = await getAccessTokenSilently();
      const response = await fetch(`/api/categories/filter/all-product`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRubros(data);
      } else {
        console.error("Error fetching product categories:", response.status);
      }
    } catch (error) {
      console.error("Error fetching product categories:", error);
    }
  };

  return { rubros };
};
