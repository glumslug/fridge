import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Container } from "react-bootstrap";
import Navbar from "./components/Navbar";
import Store from "./pages/Store";
import { FridgeProvider } from "./context/FridgeContext";

function App() {
  const [count, setCount] = useState(0);

  return (
    <FridgeProvider>
      <Navbar />
      <Container className="mb-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
        </Routes>
      </Container>
    </FridgeProvider>
  );
}

export default App;
