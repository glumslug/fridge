import axios, { AxiosError, AxiosResponse } from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { userData, item } from "../utilities/interfaces";

type credentials = {
  email: string;
  password: string;
  name?: string;
};

type CRUD = {
  product: number;
  atHome: number;
  amount: number;
};

type AuthProviderProps = {
  children: ReactNode;
};

type Message = {
  message: string;
};

type AuthContext = {
  userData: userData | null;
  refreshContext: () => void;
  loginUser: ({
    email,
    password,
  }: credentials) => Promise<void | Error | AxiosResponse>;
  registerUser: ({ email, password, name }: credentials) => Promise<void>;
  logoutUser: () => void;
  purchaseItems: ({
    product,
    atHome,
    amount,
  }: CRUD) => Promise<Message | undefined>;
  manageItems: ({
    product,
    atHome,
    amount,
  }: CRUD) => Promise<Message | undefined>;
};
export const AuthContext = createContext({} as AuthContext);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [userData, setUserData] = useState<userData | null>();
  useEffect(() => {
    refreshData();
  }, []);
  const refreshData = async () => {
    const response = await axios({
      url: "/db/items/",
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.data) {
      const data: userData = response.data;
      localStorage.setItem("fridge", JSON.stringify(data));
      refreshContext();
    }
  };

  const refreshContext = () => {
    const data = localStorage.getItem("user");
    if (data) {
      setUserData(JSON.parse(data));
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
      setUserData(user.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Access to config, request, and response
        console.log(error.response); // this is the main part. Use the response property from the error object
        alert(error.response?.data);
        return error.response as AxiosResponse;
      } else {
        // Just a stock error
        return error as Error;
      }
    }
  };
  const registerUser = async ({ email, password, name }: credentials) => {
    const user = await axios.post("/db/register", {
      email: email,
      password: password,
    });
    if (user.data) {
      localStorage.setItem("user", JSON.stringify(user.data));
      setUserData(user.data);
    }
  };

  const logoutUser = () => {
    console.log("logoout");
    localStorage.removeItem("user");
    setUserData(null);
  };

  const purchaseItems = async ({ product, atHome, amount }: CRUD) => {
    const add = await axios.post(
      `/db/${atHome === 0 ? "add-item" : "update-item-quantity"}`,
      {
        product: product,
        owner: userData?.id,
        quantity: amount,
      }
    );
    if (add.data) {
      if (add.data.warningStatus == 0) {
        refreshData();
        return { message: "Successfully Added!" };
      } else {
        return { message: "Something went wrong!" };
      }
    }
  };

  const manageItems = async ({ product, atHome, amount }: CRUD) => {
    const add = await axios.post(
      `/db/${atHome + amount == 0 ? "delete-item" : "update-item-quantity"}`,
      {
        product: product,
        owner: userData?.id,
        quantity: amount,
      }
    );
    if (add.data) {
      if (add.data.warningStatus == 0) {
        refreshData();
        return { message: "Successfully used/tossed!" };
      } else {
        return { message: "Something went wrong!" };
      }
    }
  };
  return (
    <AuthContext.Provider
      value={{
        userData,
        loginUser,
        registerUser,
        logoutUser,
        purchaseItems,
        manageItems,
        refreshContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
