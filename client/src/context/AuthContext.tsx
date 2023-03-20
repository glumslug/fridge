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
  basketData,
  productSearchItem,
  basketItem,
} from "../utilities/interfaces";
import { useNavigate } from "react-router-dom";
import YesNoModal from "../components/YesNoModal";

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

type bulkAddProps = {
  values: number[][];
};

type AuthProviderProps = {
  children: ReactNode;
};

type Message = {
  message: string;
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
  ) => Promise<productSearchItem[] | Error | AxiosResponse>;
  registerUser: ({
    email,
    password,
    name,
  }: credentials) => Promise<void | Error | AxiosResponse>;
  logoutUser: () => void;
  manageCart: ({
    product,
    amount,
    action,
  }: CRUD) => Promise<Message | undefined>;
  bulkCartAdd: ({ values }: bulkAddProps) => Promise<Message | undefined>;
  manageBasket: ({ product, amount, action }: CRUD) => void;
  upsertItem: ({ product, amount }: CRUD) => Promise<Message | undefined>;
  downsertItem: ({ product, amount }: CRUD) => Promise<Message | undefined>;
  manageSavedRecipes: (
    id: number,
    action: string
  ) => Promise<Message | undefined>;
};
export const AuthContext = createContext({} as AuthContext);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [userData, setUserData] = useState<userData | null>(null);
  const [basketData, setBasketData] = useState<basketData | null>(null);
  const navigate = useNavigate();
  //Get context from localstorage on page refresh
  useEffect(() => {
    const user = localStorage.getItem("user");
    const basket = localStorage.getItem("basket");
    user ? setUserData(JSON.parse(user)) : null;
    basket ? setBasketData(JSON.parse(basket)) : null;
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
    if (response.data && userData) {
      const data: userData = response.data;
      const newData = {
        id: userData.id,
        name: userData.name,
        items: data.items,
        cart: data.cart,
        token: userData?.token,
        myRecipes: data.myRecipes,
        savedRecipes: data.savedRecipes,
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
    try {
      const response = await axios.post("/db/register", {
        email: email,
        password: password,
        name: name,
      });

      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setUserData(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data);
      } else {
        return error as Error;
      }
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("basket");
    setBasketData(null);
    setUserData(null);
    navigate(0);
  };

  // downsert item -- for use/toss items in home tab
  const downsertItem = async ({ product, amount }: CRUD) => {
    const add = await axios({
      url: "/db/downsertItem",
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
        refreshContext();
        return { message: "Success!" };
      } else {
        return { message: "Something went wrong!" };
      }
    }
  };

  // Add things to your shopping list **probably should refactor to call this list
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

  // Add things to your shopping list in bulk
  const bulkCartAdd = async ({ values }: bulkAddProps) => {
    // action is add, remove, or update
    const add = await axios({
      url: "/db/cart/bulkAdd",
      method: "POST",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
        "Content-Type": "application/json",
      },
      data: {
        values: values,
      },
    });
    if (add.data) {
      if (add.data.warningStatus == 0) {
        toast.success(`Items added successfully.`);
        refreshContext();
      } else {
        return { message: "Something went wrong!" };
      }
    }
  };

  const manageBasket = ({ product, amount, action }: CRUD) => {
    // This is for when you're shopping, adding things to your purchase order
    const localBasket = localStorage.getItem("basket");
    const basket = localBasket ? JSON.parse(localBasket) : { items: [] };
    let index = basket.items.findIndex(
      (item: basketItem) => item.product == product
    );
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

      return response.data as productSearchItem[];
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

  // Add things to your shopping list in bulk
  const manageSavedRecipes = async (id: number, action: string) => {
    console.log(id, action);
    const add = await axios({
      url: `/db/savedRecipes/${action}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
        "Content-Type": "application/json",
      },
      data: {
        id: id,
      },
    });
    if (add.data) {
      if (add.data.warningStatus == 0) {
        toast.success(`Recipe ${action}d successfully.`);
        refreshContext();
      } else {
        return { message: "Something went wrong!" };
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
        bulkCartAdd,
        manageBasket,
        downsertItem,
        refreshContext,
        searchProducts,
        upsertItem,
        manageSavedRecipes,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
