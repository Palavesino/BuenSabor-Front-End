import { Route } from "react-router-dom";
import RoutesWithNotFound from "../Util/routes-with-not-found"
import { lazy } from "react";
import { RouteAccessRole } from "./RouteAccessRole.tsx";
import { UserRole } from "../components/Enum/UserRole.ts";

const UserTable = lazy(() => import('../components/Admin/UserComponents/UserTable'));
const IngredientTable = lazy(() => import('../components/Admin/IngredientComponents/IngredientTable'));
const M_ProductTable = lazy(() => import('../components/Admin/ManufacturedProductComponents/M_ProductTable'));
const RecipesTable = lazy(() => import('../components/Admin/RecipeComponents/RecipeTable'));
const ListarCategorys = lazy(() => import('../components/Admin/CategoriesComponents/CategoryTable.tsx'));
const Menu = lazy(() => import('../components/Admin/Menu'));
const ProductTable = lazy(() => import('../components/Admin/ProductComponents/ProductTable'));
const UserProfile = lazy(() => import('../components/Profile/UserProfile.tsx'));
const PaymentConfirmation = lazy(() => import('../components/Pages/PaymentMP/PaymentConfirmation.tsx'));
const OrderUserTable = lazy(() => import('../components/Order/OrderUserTable.tsx'));
const Cajero = lazy(() => import('../components/Cajero/Cajero.tsx'));
const Delivery = lazy(() => import('../components/Delivery/Delivery.tsx'));
const Cocinero = lazy(() => import('../components/Cocinero/Cocinero.tsx'));

const Estadistica = lazy(() => import('../components/Admin/Estadisticas/EstadisticaProduct.tsx'));

const StockTable = lazy(() => import('../components/Admin/StockComponents/StockTable.tsx'));
interface Props {
    permission: UserRole;
}
export const Private = ({ permission }: Props) => {
    return (
        <RoutesWithNotFound>
            <Route path="/user" element={<RouteAccessRole isRolPermited={permission === UserRole.admin} > <UserTable /> </RouteAccessRole>}></Route>
            <Route path="/ingredients" element={<RouteAccessRole isRolPermited={permission === UserRole.cocinero || permission === UserRole.admin} > <IngredientTable /> </RouteAccessRole>}></Route>
            <Route path="/stock" element={<RouteAccessRole isRolPermited={permission === UserRole.cocinero || permission === UserRole.admin} > <StockTable/> </RouteAccessRole>}></Route>
            <Route path="/Mproducts" element={<RouteAccessRole isRolPermited={permission === UserRole.admin} > <M_ProductTable /> </RouteAccessRole>}></Route>
            <Route path="/recipe" element={<RouteAccessRole isRolPermited={permission === UserRole.admin} > <RecipesTable /> </RouteAccessRole>}></Route>
            <Route path="/categoria" element={<RouteAccessRole isRolPermited={permission === UserRole.admin} > <ListarCategorys /> </RouteAccessRole>}></Route>
            <Route path="/admin" element={<RouteAccessRole isRolPermited={permission === UserRole.admin} > <Menu /> </RouteAccessRole>}></Route>
            <Route path="/products" element={<RouteAccessRole isRolPermited={permission === UserRole.admin} > <ProductTable /> </RouteAccessRole>}></Route>
            <Route path="/profile" element={<RouteAccessRole isRolPermited={permission !== UserRole.espectador} > <UserProfile /> </RouteAccessRole>}></Route>
            <Route path="/payment" element={<RouteAccessRole isRolPermited={permission !== UserRole.espectador} > <PaymentConfirmation /> </RouteAccessRole>}></Route>
            <Route path="/user/orders" element={<RouteAccessRole isRolPermited={permission !== UserRole.espectador} > <OrderUserTable /> </RouteAccessRole>}></Route>
            <Route path="/cajero" element={<RouteAccessRole isRolPermited={permission === UserRole.cajero} > <Cajero /> </RouteAccessRole>}></Route>
            <Route path="/delivery" element={<RouteAccessRole isRolPermited={permission === UserRole.delivery} > <Delivery /> </RouteAccessRole>}></Route>
            <Route path="/cocinero" element={<RouteAccessRole isRolPermited={permission === UserRole.cocinero} > <Cocinero /> </RouteAccessRole>}></Route>
            
            <Route path="/estadistica" element={<RouteAccessRole isRolPermited={permission === UserRole.admin} > <Estadistica /> </RouteAccessRole>}></Route>
        </RoutesWithNotFound>
    )
}
export default Private;