import { useSpinner } from "../../../../context/SpinnerContext";

export const useGetItems = () => {
    const { showSpinner, hideSpinner } = useSpinner();
    const getItems = async () => {
        showSpinner()
        try {
            const response = await fetch(`/api/order/public/items`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error(`Error fetching data:`, response.status);
            }
        } catch (error) {
            console.error("Error Get Items from BD = ", error);

        }finally {
            hideSpinner();
        }

    }
    return getItems;
}
