import { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
type formType = {
  email: string | null;
  password: string | null;
};
const Login = () => {
  const navigate = useNavigate();
  const { userData, loginUser } = useAuth();
  if (userData) {
    navigate("/");
  }
  const [form, setForm] = useState<formType>({ email: null, password: null });
  const setField = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = form;
    if (!email) {
      alert("Please type an email!");
      return;
    }
    if (!password) {
      alert("Please type a password!");
      return;
    }
    loginUser({ email, password });
  };

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          onChange={(e) => setField("email", e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          onChange={(e) => setField("password", e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit" onClick={(e) => handleSubmit(e)}>
        Submit
      </Button>
    </Form>
  );
};

export default Login;
