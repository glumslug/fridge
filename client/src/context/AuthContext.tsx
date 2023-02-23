import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { user } from "../utilities/interfaces";

const AuthContext = createContext({} as AuthContext);

export function useAuth() {
  return useContext(AuthContext);
}

export function FridgeProvider({ children }) {
  const getUser = async () => {
    const user = await axios.get("/db/user");
    if (user.data) {
      localStorage.setItem("user", JSON.stringify(user.data));
    }
  };
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}
