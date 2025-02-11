import { Route } from "react-router-dom";
import { RouteAccessRole } from "./RouteAccessRole.tsx";
import { UserRole } from "../components/Enum/UserRole";
import Products from "../components/Pages/Products/Products.tsx";

// Importaciones de Assets
import AuthGuard from "./AuthGuard.tsx";
import RoutesWithNotFound from "../Util/routes-with-not-found.tsx";
import { Suspense, lazy, useState } from "react";
import { usePermission } from "../context/PermissionContext.tsx";
import { UserSingUp } from "../components/Auth0/SignUp/UserSignUp.tsx";

import SpinnerLoading from "../components/SpinnerLoading/SpinnerLoading.tsx";

const Private = lazy(() => import('./Private.tsx'));
const Page401 = lazy(() => import('../components/Pages/401/Page401.tsx'));
const Carrito = lazy(() => import('../components/Pages/Cart/Cart.tsx'));
const ProductDetails = lazy(() => import('../components/Pages/ProductDetails/ProductDetails.tsx'));



const Router = () => {
  const { permission } = usePermission();
  //Inicializar una variable con un valor obtenido del almacenamiento local, o true si no hay ningún valor almacenado.
  const [firstLogIn, setFirstLogIn] = useState(() => {
    const persistedFirstLogIn = localStorage.getItem('firstLogIn');
    return persistedFirstLogIn !== null ? JSON.parse(persistedFirstLogIn) : true;

  });
  return (
    <>
      <Suspense fallback={<h1>Loding...</h1>}>
        {firstLogIn ? <UserSingUp firstLogIn={firstLogIn} setFirstLogIn={setFirstLogIn} /> : null}
        <RoutesWithNotFound>

          <Route path="/" element={
            <RouteAccessRole
              isRolPermited={permission === UserRole.user || permission === UserRole.admin || permission === UserRole.espectador}
              path={permission === UserRole.cajero ? "/private/cajero" : (permission === UserRole.delivery ? "/private/delivery" : (permission === UserRole.cocinero ? "/private/cocinero" : "/"))}
            >
              <Products />
              {/* <Home /> */}
            </RouteAccessRole>
          } />
          <Route element={<AuthGuard />}>
            <Route path="/private/*" element={<Private permission={permission} />}></Route>
          </Route>
          <Route path="/carrito" element={
            <RouteAccessRole
              isRolPermited={permission === UserRole.user || permission === UserRole.espectador  || permission === UserRole.admin}
              path={'/carrito'}
            >
              <Carrito />
              {/* <Home /> */}
            </RouteAccessRole>
          } />
          {/* <Route path="/carrito" element={<Carrito />}></Route> */}
          {/* <Route path="/promociones" element={<h1>Promociones</h1>}></Route> */}
          {/* <Route path="/cajero" element={<Cajero/>}></Route>
          <Route path="/delivery" element={<Delivery/>}></Route>
          <Route path="/cocinero" element={<Cocinero />}></Route> */}
          {/* <Route path="/estadistica" element={<Estadistica />}></Route> */}
         
          <Route path="/spinner" element={<SpinnerLoading/>}></Route>
          <Route
            path="/productos"

            element={<Products />}
          ></Route>
          <Route path="/promociones" element={<h1>Promociones</h1>}></Route>
          <Route
            path="/productos/:type/:productId"
            element={<ProductDetails />}
          />
          <Route path="/unauthenticated" element={<Page401 />} />
        </RoutesWithNotFound>
      </Suspense>
    </>
  );
};

export default Router;