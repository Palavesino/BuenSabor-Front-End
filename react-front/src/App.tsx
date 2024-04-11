// Importaciones de dependencias
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PermissionProvider } from "./context/PermissionContext.tsx";
// Importaciones de componentes, funciones y modelos
import Footer from "./components/Common/Footer/Footer.tsx";
import NavBar from "./components/Common/NavBar/NavBar.tsx";
import Router from "./Routes/Router.tsx";

// Importaciones de estilos
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // Renderizado del componente
  return (
    <>

      <BrowserRouter>
        <PermissionProvider>
          <div className="root">
            <NavBar />
            <div className="main-container">
              <Router />
            </div>
            <Footer />
            <ToastContainer />
          </div>
        </PermissionProvider>
      </BrowserRouter>
    </>
  );
}

export default App;