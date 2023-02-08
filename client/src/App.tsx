import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Container } from "react-bootstrap";
import Navbar from "./components/Navbar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <Container className="mb-4">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
