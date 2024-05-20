import { toast } from "react-toastify";
import { Image } from "../Interfaces/Image";
import { useAuth0 } from "@auth0/auth0-react";

export const usePostImage = () => {
    const { getAccessTokenSilently } = useAuth0();
    const PostImage = async (obj: Image, file?: File, edit: boolean = false, message: boolean = false) => {
        try {
            let accessToken = await getAccessTokenSilently();
            const formData = new FormData();
            const dtoBlob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
            formData.append('dto', dtoBlob);
            if (file) {
                formData.append('imageFile', file, file.name);
            } else {
                console.error("No se encuentra archivo")
            }
            if (edit) {
                const imageResponse = await fetch(`/api/images/replace-image/${obj.id}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: formData,
                });
                if (!imageResponse.ok) {
                    toast.error("Ha ocurrido un error", {
                        position: "top-center",
                    });
                } else if (message) {
                    toast.success(`😎 Editado Exitosamente!`, { position: "top-center" });
                }
            } else {
                const response = await fetch('/api/images/save-image', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: formData,
                });
                if (!response.ok) {
                    toast.error("Ha ocurrido un error", {
                        position: "top-center",
                    });
                } else if (message) {
                    toast.success(`😎 Insertado Exitosamente!`, { position: "top-center" });
                }
            }

        } catch (error) {
            console.error("Error al enviar la imagen:", error);
            toast.error("Ha ocurrido un error" + error, {
                position: "top-center",
            });
        }
    };
    return PostImage;
};
