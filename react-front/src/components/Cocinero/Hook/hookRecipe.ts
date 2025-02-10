import { useAuth0 } from "@auth0/auth0-react";
import { useState } from 'react';
import { Recipe } from '../../../Interfaces/ManufacturedProduct';

export const useGetRecipe = () => {
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const { getAccessTokenSilently } = useAuth0();
    
    const getRecipe = async (productId: number) => {
        try {
            //const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkRTblZvV1ZyV3hPWWRXUHFiLWswVSJ9.eyJpc3MiOiJodHRwczovL2Rldi1veXRnb3VjenlqNmk3ZHIwLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJoQ3ZLMU9icTRmVDhLQmNya01LS2sxUzBRY3ZxckFWdkBjbGllbnRzIiwiYXVkIjoibG9jYWxob3N0OjgwODAiLCJpYXQiOjE3MzI1NjQ4ODUsImV4cCI6MTczMjY1MTI4NSwic2NvcGUiOiJhZG1pbiB1c2VyIGNvY2luZXJvIGNhamVybyBkZWxpdmVyeSAiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMiLCJhenAiOiJoQ3ZLMU9icTRmVDhLQmNya01LS2sxUzBRY3ZxckFWdiIsInBlcm1pc3Npb25zIjpbImFkbWluIiwidXNlciIsImNvY2luZXJvIiwiY2FqZXJvIiwiZGVsaXZlcnkgIl19.eJlBRAO1aywB4kHRp-84-H3kV3DbUcjAr0-IRoMY-SInCA77JU3fm_omsIYFQ1geNaB8BXqA4Ofo6UFBfgWpNFdjpZtgaCdKpgBtZ-UCx4ZmCA53nRklj-bq7cKUqDHMLrh0f8ij3Mhn_4IUzju9vOgX1coPGq2uoCeJvPLHoYPXD4JpF7Y---VN1sXzeYOdAdhp_YGG3X055BOmoZIGboUJpO5VWe0UUW0E2fgfHBMycWu9gOpYWkPElk7RlZyGo281hLpj-fDVRdE73MThAft_Psunzn5r99uuigp1PaeAeFLKHsR_0yZaTrbtUBKqnTszW0dGP54p-oul_VS6TA"; 
            const token = await getAccessTokenSilently();
            const response = await fetch(`api/recipes/complete/${productId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                console.error("Error al obtener los datos:", response.status);
                return null;
            }

            const data = await response.json();
            //console.log("Datos obtenidos:", data);
            setRecipe(data); // Actualizamos el estado de la receta
            return data;
        } catch (error) {
            console.error("Error al hacer la solicitud:", error);
            return null;
        }
    };

    return { getRecipe, recipe }; // Devolvemos la función y la receta
};
