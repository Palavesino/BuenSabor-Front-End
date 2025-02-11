import { useAuth0 } from "@auth0/auth0-react";
import { useSpinner } from "../../../../context/SpinnerContext";

export const usePutUserLogOut = () => {
    const { getAccessTokenSilently } = useAuth0();
    const { showSpinner, hideSpinner } = useSpinner();
    const logOut = async (userAuth0Id: string) => {
        showSpinner();
        try {
            const token = await getAccessTokenSilently();
            const encodedUserId = encodeURIComponent(userAuth0Id).replaceAll('|', '%7C');

            await fetch(`/api/users/log-out/${encodedUserId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error("Error Log Out from user:", error);
        } finally {
            hideSpinner();
        }

    }
    return logOut;
}