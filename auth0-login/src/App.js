import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";
import LoginButton from "./components/LoginButt";
import LogoutButton from "./components/LogoutButton";
import Profile from "./components/Profile";
function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  if (isLoading) return <h1>Loding...</h1>;
  return (
    <div className="App">
      <h1>Application</h1>
      {isAuthenticated ? <LogoutButton /> : <LoginButton />}
      <Profile />
    </div>
  );
}

export default App;
