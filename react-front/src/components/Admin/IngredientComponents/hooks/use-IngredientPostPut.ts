import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { IngredientXStock } from "../../../../Interfaces/Ingredient";
// Función IngredientPostPut
const IngredientPostPut = () => {
    const { getAccessTokenSilently } = useAuth0();

    const fetchWithAuth = async (url: string, method: string, body: any, token: string, notification = false) => {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Error en ${method} ${url}: ${response.statusText}`);
        }
        if (notification) {
            if (response.ok) {
                toast.success(`😎 Insertado Exitosamente!`, {
                    position: "top-center",
                });
            }
        }

        return response.json();
    };

    const postXPut = async (endpointPost: string, endpointPut: string, obj: IngredientXStock) => {
        try {
            const token = await getAccessTokenSilently();
            const isPost = obj.ingredient.id === 0;

            if (isPost) {
                const ingredientData = await fetchWithAuth(endpointPost, 'POST', obj.ingredient, token);
                obj.stock.ingredientStockID = ingredientData.id;

                await fetchWithAuth(`/api/stock/save-stock?type=M&relationId=${obj.stock.ingredientStockID}`, 'POST', obj.stock, token,true);
            } else {
                await fetchWithAuth(`${endpointPut}/${obj.ingredient.id}`, 'PUT', obj.ingredient, token,true);
            }
        } catch (error) {
            handleError(error);
        }
    };

    const handleError = (error: any) => {
        console.error("Ha ocurrido un error: ", error.message || error);
        toast.error('Ha ocurrido un error', { position: 'top-center' });
    };

    return postXPut;
};


export default IngredientPostPut;

