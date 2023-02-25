import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Container } from "react-bootstrap";
import Navbar from "./components/Navbar";
import Store from "./pages/Store";
import { FridgeProvider } from "./context/FridgeContext";
import Recipes from "./pages/Recipes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoutes from "./utilities/ProtectedRoutes";
import { AuthProvider } from "./context/AuthContext";
const { UserProtected } = ProtectedRoutes;

function App() {
  const [count, setCount] = useState(0);

  return (
    <FridgeProvider>
      <AuthProvider>
        <Navbar />
        <Container className="mb-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<UserProtected />}>
              <Route path="/" element={<Home />} />
              <Route path="/store" element={<Store />} />
              <Route path="/recipes" element={<Recipes />} />
            </Route>
          </Routes>
        </Container>
      </AuthProvider>
    </FridgeProvider>
  );
}

export default App;
