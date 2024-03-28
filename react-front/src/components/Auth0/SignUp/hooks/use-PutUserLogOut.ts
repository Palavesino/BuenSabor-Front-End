import { useAuth0 } from "@auth0/auth0-react";

export const usePutUserLogOut = () => {
    const { getAccessTokenSilently } = useAuth0();
    const logOut = async (userAuth0Id: string) => {
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
        }

    }
    return logOut;
}