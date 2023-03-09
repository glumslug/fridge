import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  userData,
  item,
  cart_item,
  items,
  searchItem,
  basketData,
} from "../utilities/interfaces";

type credentials = {
  email: string;
  password: string;
  name?: string;
};

type CRUD = {
  product: number;
  atHome?: number;
  amount: number;
  action?: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

type Message = {
  message: string;
};

type refreshProps = {
  action?: string;
};

type AuthContext = {
  userData: userData | null;
  basketData: basketData | null;
  refreshContext: (action?: string) => void;
  loginUser: ({
    email,
    password,
  }: credentials) => Promise<void | Error | AxiosResponse>;
  searchProducts: (
    search: string
  ) => Promise<searchItem[] | Error | AxiosResponse>;
  registerUser: ({ email, password, name }: credentials) => Promise<void>;
  logoutUser: () => void;
  manageCart: ({
    product,
    amount,
    action,
  }: CRUD) => Promise<Message | undefined>;
  manageBasket: ({ product, amount, action }: CRUD) => void;
  upsertItem: ({ product, amount }: CRUD) => Promise<Message | undefined>;
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
  const [basketData, setBasketData] = useState<basketData | null>(null);
  //Get context from localstorage on page refresh
  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("user")));
    setBasketData(JSON.parse(localStorage.getItem("basket")));
  }, []);
  const refreshContext = async (action?: string) => {
    const response = await axios({
      url: "/db/fullContext/",
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.data) {
      const data: { items: items[]; cart: cart_item } = response.data;
      const newData = {
        id: userData?.id,
        name: userData?.name,
        items: data.items,
        cart: data.cart,
        token: userData?.token,
      };

      setUserData(newData);
      localStorage.setItem("user", JSON.stringify(newData));
      console.log("refreshed");
      console.log(action);
      if (action == "purchase") {
        localStorage.removeItem("basket");
        setBasketData(null);
      }
      return { message: "Refreshed successfully." };
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
    localStorage.removeItem("user");
    localStorage.removeItem("basket");
    setBasketData(null);
    setUserData(null);
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
    console.log(product);
    if (add.data) {
      if (add.data.warningStatus == 0) {
        refreshContext();
      } else {
        return { message: "Something went wrong!" };
      }
    }
  };

  const manageCart = async ({ product, amount, action }: CRUD) => {
    // action is add, remove, or update
    const add = await axios({
      url: "/db/cart/" + action,
      method: "POST",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
        "Content-Type": "application/json",
      },
      data: {
        product: product,
        quantity: amount,
      },
    });
    if (add.data) {
      if (add.data.warningStatus == 0) {
        toast.success(
          `Item ${action}${action == "add" ? "ed" : "d"} successfully.`
        );
        refreshContext();
      } else {
        return { message: "Something went wrong!" };
      }
    }
  };

  const manageBasket = ({ product, amount, action }: CRUD) => {
    const basket = JSON.parse(localStorage.getItem("basket")) || { items: [] };
    let index = basket.items.findIndex((item) => item.product == product);
    console.log(action);
    switch (action) {
      case "add":
        basket.items.push({ product, amount });
        localStorage.setItem("basket", JSON.stringify(basket));
        setBasketData(basket);
        break;
      case "remove":
        basket.items.splice(index, 1);
        localStorage.setItem("basket", JSON.stringify(basket));
        setBasketData(basket);
        break;
      case "update":
        basket.items[index].amount = amount;
        localStorage.setItem("basket", JSON.stringify(basket));
        break;
      default:
        break;
    }
  };

  const upsertItem = async ({ product, amount }: CRUD) => {
    const add = await axios.post(`/db/upsertItem`, {
      product: product,
      owner: userData?.id,
      quantity: amount,
    });
    console.log(userData?.id, product);
    if (add.data) {
      return { message: "Successfully upserted item." };
      // refreshContext("purchase");
    } else {
      return { message: "Something went wrong!" };
    }
  };

  const searchProducts = async (search: string) => {
    try {
      const response = await axios.post("db/products", { search: search });

      return response.data as searchItem[];
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
        basketData,
        loginUser,
        registerUser,
        logoutUser,
        manageCart,
        manageBasket,
        manageItems,
        refreshContext,
        searchProducts,
        upsertItem,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
