export const useGetImageId = () => {
    const GetImageId = async (id: number, filter: string) => {
        try {
            const response = await fetch(`/api/images/public/filter/${filter}/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.text();
                if (!data) {
                    return null;
                } else {
                    return JSON.parse(data);
                }
            } else {
                console.error(`Error fetching data:`, response.status);
            }
        } catch (error) {
            console.error("Error Get Image Id from BD:", error);
        }

    }
    return GetImageId;
}
