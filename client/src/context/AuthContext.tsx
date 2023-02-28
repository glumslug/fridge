import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
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
  searchProducts: (search: string) => Promise<void | Error | AxiosResponse>;
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
  const [userData, setUserData] = useState<userData | null>(null);
  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("user")));
  }, []);
  const refreshContext = async () => {
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
      const newData = {
        id: userData?.id,
        name: userData?.name,
        items: data.items,
        token: userData?.token,
      };
      localStorage.setItem("user", JSON.stringify(newData));
      setUserData(newData);
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
        toast.error(error.response?.data);
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
        toast.success("Purchased item(s)!");
        refreshContext();
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
    console.log(userData?.id, product);
    if (add.data) {
      if (add.data.warningStatus == 0) {
        refreshContext();
      } else {
        return { message: "Something went wrong!" };
      }
    }
  };

  const searchProducts = async (search: string) => {
    try {
      const response = await axios.post("db/products", { search: search });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Access to config, request, and response
        console.log(error.response); // this is the main part. Use the response property from the error object
        toast.error(error.response?.data);
        return error.response as AxiosResponse;
      } else {
        // Just a stock error
        return error as Error;
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
        searchProducts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
