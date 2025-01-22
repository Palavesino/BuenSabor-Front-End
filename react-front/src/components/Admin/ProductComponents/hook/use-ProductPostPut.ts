import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { ProductXStock } from "../../../../Interfaces/Product";
import { usePostImage } from "../../../../Util/PostImage";
import { Image } from "../../../../Interfaces/Image";
// Función ProductPostPut
const ProductPostPut = () => {
    const { getAccessTokenSilently } = useAuth0();
    const changeImage = usePostImage();
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

    const postXPut = async (endpointPost: string, endpointPut: string, obj: ProductXStock, oldImage?: Image) => {
        try {
            const token = await getAccessTokenSilently();
            const isPost = obj.product.id === 0;

            if (isPost) {
                const ProductData = await fetchWithAuth(endpointPost, 'POST', obj.product, token);
                obj.stock.productStockID = ProductData.id;
                await fetchWithAuth(`/api/stock/save-stock?type=P&relationId=${obj.stock.productStockID}`, 'POST', obj.stock, token);
                await changeImage(2, ProductData.id, obj.file ? obj.file : undefined,false,true);
            } else {
                await fetchWithAuth(`${endpointPut}/${obj.product.id}`, 'PUT', obj.product, token,true);
                if (oldImage && obj.file) {
                    await changeImage(2, obj.product.id, obj.file, true, false, oldImage.id);
                }
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


export default ProductPostPut;