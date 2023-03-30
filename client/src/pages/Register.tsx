import axios from "axios";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { userData } from "../utilities/interfaces";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [info, setInfo] = useState({
    email: "",
    name: "",
    password: "",
    password2: "",
  });
  const { registerUser } = useAuth();

  const submitRegistration = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!info.email) {
      toast.error("Please provide an email.");
      return;
    }
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // if (!re.test(info.email)) {
    //   toast.error("Please enter a valid email.");
    //   return;
    // }
    if (!info.name) {
      toast.error("Please enter a name.");
      return;
    }
    if (!info.password) {
      toast.error("Please enter a password.");
      return;
    }
    if (!info.password2) {
      toast.error("Please retype your password.");
      return;
    }
    if (info.password !== info.password2) {
      toast.error("Passwords don't match.");
      return;
    }
    registerUser({
      email: info.email,
      password: info.password,
      name: info.name,
    });
  };
  return (
    <Form style={{ maxWidth: "40rem" }}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={info.email}
          onChange={(e) => setInfo({ ...info, email: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your name"
          value={info.name}
          onChange={(e) => setInfo({ ...info, name: e.target.value })}
        />
        <Form.Text className="text-muted">
          What you would like to be called.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={info.password}
          onChange={(e) => setInfo({ ...info, password: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Re-Type Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Re-Type Password"
          value={info.password2}
          onChange={(e) => setInfo({ ...info, password2: e.target.value })}
        />
      </Form.Group>

      <Button
        variant="primary"
        type="button"
        onClick={(e: React.FormEvent<HTMLButtonElement>) =>
          submitRegistration(e)
        }
      >
        Register
      </Button>
    </Form>
  );
}

export default Register;
