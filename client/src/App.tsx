import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Container } from "react-bootstrap";
import Navbar from "./components/Navbar";
import Store from "./pages/Store";
import Recipes from "./pages/Recipes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoutes from "./utilities/ProtectedRoutes";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./pages/LandingPage";
import Footer from "./components/Footer";
import NoPage from "./pages/NoPage";
const { UserProtected, NoUser } = ProtectedRoutes;

function App() {
  const [count, setCount] = useState(0);

  return (
    <AuthProvider>
      <Navbar />
      <div
        className="d-flex flex-column justify-content-between position-absolute w-100"
        style={{
          height: "100%",
          maxHeight: "100vh",
          overflowX: "hidden",
          paddingTop: "5rem",
          paddingBottom: ".5rem",
          top: "0",
          left: "0",
        }}
      >
        <Container className="mb-4">
          <Routes>
            <Route element={<NoUser />}>
              <Route path="/" element={<LandingPage />}></Route>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route element={<UserProtected />}>
              <Route path="/home" element={<Home />} />
              <Route path="/store" element={<Store />} />
              <Route path="/recipes" element={<Recipes />} />
            </Route>
            <Route path="*" element={<NoPage />} />
          </Routes>

          <ToastContainer />
        </Container>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
