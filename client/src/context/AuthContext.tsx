import axios from "axios";
import { createContext, ReactNode, useContext } from "react";

type credentials = {
  email: string;
  password: string;
  name?: string;
};

type userObject = {
  id: number;
  name: string;
  token: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

type AuthContext = {
  getUser: () => userObject | null;
  loginUser: ({ email, password }: credentials) => Promise<void>;
  registerUser: ({ email, password, name }: credentials) => Promise<void>;
};
export const AuthContext = createContext({} as AuthContext);

export function AuthProvider({ children }: AuthProviderProps) {
  const getUser = () => {
    const storage: string | null = localStorage.getItem("user");
    console.log(storage);
    if (storage) {
      const userObject: userObject = JSON.parse(storage);
      return userObject;
    } else {
      return null;
    }
  };
  const loginUser = async ({ email, password }: credentials) => {
    localStorage.removeItem("user");
    console.table({ email, password });
    try {
      const user = await axios.post("/db/login", {
        email: email,
        password: password,
      });

      localStorage.setItem("user", JSON.stringify(user.data));
      return;
    } catch (error) {
      console.log(error.response); // this is the main part. Use the response property from the error object
      alert(error.response.data);
      return error.response;
    }
  };
  const registerUser = async ({ email, password, name }: credentials) => {
    const user = await axios.post("/db/register", {
      email: email,
      password: password,
    });
    if (user.data) {
      localStorage.setItem("user", JSON.stringify(user.data));
    }
  };
  return (
    <AuthContext.Provider value={{ getUser, loginUser, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
}
