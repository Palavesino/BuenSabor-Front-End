import { Route, Routes } from "react-router-dom";
import { MenuDes } from "./MenuDes";
export const AppLayout = () => (
    <>
    <div>
      <MenuDes />
      <Routes>
        <Route path="/" element={<p>home</p> } />
        <Route path="/products" element={<p>product</p>} />
        <Route path="/rubro" element={<p>rubro</p>} />
      </Routes>
    </div>
  </>
  );