import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";

export const usePatchPicture = () => {
    const { getAccessTokenSilently } = useAuth0();
    const changeUserPicture = async (userAuth0Id: string, picture: string) => {
        try {
            const encodedUserId = encodeURIComponent(userAuth0Id).replaceAll("|", "%7C");
            const token = await getAccessTokenSilently();
            const requestBody = { picture: picture };
            const response = await fetch(`/api/users/picture/${encodedUserId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            }
            );
            if (!response.ok) {
                toast.error("Ha ocurrido un error", {
                    position: "top-center",
                });
            }
        } catch (error) {
            console.error("Error assigning new iamge to user:", error);
            toast.error("Ha ocurrido un error" + error, {
                position: "top-center",
            });
        }
    };
    return changeUserPicture;
};
export default usePatchPicture