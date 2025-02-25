import { useAuth0 } from "@auth0/auth0-react";
import { useState } from 'react';
import { Recipe } from "../../../Interfaces/Recipe";

export const useGetRecipe = () => {
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const { getAccessTokenSilently } = useAuth0();

    const getRecipe = async (productId: number) => {
        try {
            const token = await getAccessTokenSilently();

            const response = await fetch(`/api/recipes/complete/${productId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                console.error("Error en la respuesta de la API:", response.status);
                return null;
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.error("Respuesta no es JSON:", text);
                return null;
            }

            const data = await response.json();
            setRecipe(data);
            return data;
        } catch (error) {
            console.error("Error al hacer la solicitud:", error);
            return null;
        }
    };

    return { getRecipe, recipe };
};
