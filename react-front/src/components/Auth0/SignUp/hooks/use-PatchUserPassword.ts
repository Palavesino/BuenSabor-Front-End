import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { useSpinner } from "../../../../context/SpinnerContext";

export const usePatchUserPassword = () => {
    const { getAccessTokenSilently } = useAuth0();
    const { showSpinner, hideSpinner } = useSpinner();
    const changeUserPassword = async (userAuth0Id: string, password: string) => {
        showSpinner();
        try {
            const encodedUserId = encodeURIComponent(userAuth0Id).replaceAll("|", "%7C");
            const token = await getAccessTokenSilently();
            const requestBody = { password: password };
            const response = await fetch(`/api/users/change-password/${encodedUserId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            }
            );
            if (response.ok) {
                toast.success(`😎 Contraseña guardad Exitosamente`, {
                    position: "top-center",
                });
            }
        } catch (error) {
            console.error("Error assigning new password to user:", error);
            toast.error("Ha ocurrido un error" + error, {
                position: "top-center",
            });
        } finally {
            hideSpinner();
        }
    };
    return changeUserPassword;
};