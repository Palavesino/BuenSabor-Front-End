import { useParams } from "react-router-dom";
import CartTable from "./CartTable"

const Carrito = () => {
    const { idOrder } = useParams<{ idOrder: string }>();
    return (
        <>
            <CartTable idOrder={Number(idOrder)} />
        </>
    )
}
export default Carrito