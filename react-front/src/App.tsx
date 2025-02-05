// Importaciones de dependencias
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PermissionProvider } from "./context/PermissionContext.tsx";
import { CartProvider } from "./context/CartContext.tsx";
// Importaciones de componentes, funciones y modelos
import Footer from "./components/Common/Footer/Footer.tsx";
import NavBar from "./components/Common/NavBar/NavBar.tsx";
import Router from "./Routes/Router.tsx";

// Importaciones de estilos
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { SpinnerProvider } from "./context/SpinnerContext.tsx";
import SpinnerLoading from "./components/SpinnerLoading/SpinnerLoading.tsx";

function App() {
  // Renderizado del componente
  return (
    <>

      <BrowserRouter>
        <SpinnerProvider>
          <PermissionProvider>
            <CartProvider>
              <div className="root">
                <NavBar />
                <div className="main-container">
                  <Router />
                  <SpinnerLoading />
                </div>
                <Footer />
                <ToastContainer />
              </div>
            </CartProvider>
          </PermissionProvider>
        </SpinnerProvider>
      </BrowserRouter>
    </>
  );
}

export default App;