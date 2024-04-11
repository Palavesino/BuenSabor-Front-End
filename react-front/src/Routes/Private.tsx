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

interface Props {
    permission: UserRole;
}
export const Private = ({ permission }: Props) => {
   // console.log(permission);
    return (
        <RoutesWithNotFound>
            <Route path="/user" element={<RouteAccessRole isRolPermited={permission === UserRole.admin} path="/"> <UserTable /> </RouteAccessRole>}></Route>
            <Route path="/ingredients" element={<RouteAccessRole isRolPermited={permission === UserRole.cocinero || permission === UserRole.admin} path="/"> <IngredientTable /> </RouteAccessRole>}></Route>
            <Route path="/Mproducts" element={<RouteAccessRole isRolPermited={permission === UserRole.admin} path="/"> <M_ProductTable /> </RouteAccessRole>}></Route>
            <Route path="/recipe" element={<RouteAccessRole isRolPermited={permission === UserRole.admin} path="/"> <RecipesTable /> </RouteAccessRole>}></Route>
            <Route path="/categoria" element={<RouteAccessRole isRolPermited={permission === UserRole.admin} path="/"> <ListarCategorys /> </RouteAccessRole>}></Route>
            <Route path="/admin" element={<RouteAccessRole isRolPermited={permission === UserRole.admin} path="/"> <Menu /> </RouteAccessRole>}></Route>
            <Route path="/carrito" element={<h1>Carrito</h1>}></Route>
            <Route path="/products" element={<RouteAccessRole isRolPermited={permission === UserRole.admin} path="/"> <ProductTable /> </RouteAccessRole>}></Route>
        </RoutesWithNotFound>
    )
}
export default Private;