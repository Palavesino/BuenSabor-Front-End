import { Route, Routes } from "react-router-dom";
import { Page404 } from "../components/Pages/404/Page404";

interface Props {
  children: React.ReactNode;
}

function RoutesWithNotFound({ children }: Props) {
  return (
    <Routes>
      {children}
      <Route path="*" element={<Page404 />} />;
    </Routes>
  )
}
export default RoutesWithNotFound;