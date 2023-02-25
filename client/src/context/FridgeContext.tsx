import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { userData, foodByGroup } from "../utilities/interfaces";
import { AuthContext } from "./AuthContext";
type userObject = {
  id: number;
  name: string;
  token: string;
};
type FridgeProviderProps = {
  children: ReactNode;
};

type PurchaseProps = {
  product: number;
  user: number;
  atHome: number;
  amount: number;
};

type ManageProps = {
  product: number;
  user: number;
  atHome: number;
  amount: number;
};

type Message = {
  message: string;
};

type FridgeContext = {
  getUserData: () => userData[];
  purchaseItems: ({
    product,
    user,
    atHome,
    amount,
  }: PurchaseProps) => Promise<Message | undefined>;
  fridgeItems: userData[];
  manageItems: ({
    product,
    user,
    atHome,
    amount,
  }: ManageProps) => Promise<Message | undefined>;
};
const FridgeContext = createContext({} as FridgeContext);

export function useFridge() {
  return useContext(FridgeContext);
}

export function FridgeProvider({ children }: FridgeProviderProps) {
  const [fridgeItems, setFridgeItems] = useState<userData[]>([]);
  const json = localStorage.getItem("user") || null;
  const userObject: userObject | null = json ? JSON.parse(json) : null;
  const token = userObject?.token;
  const refreshFridgeContext = () => {
    const openFridge = async () => {
      const users = await axios({
        url: "/db/items/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (users.data) {
        const userData: userData[] = users.data;
        localStorage.setItem("fridge", JSON.stringify(userData));
        setFridgeItems(userData);
        console.log(userData);
      }
    };

    openFridge();
  };
  useEffect(() => {
    if (token) {
      refreshFridgeContext();
    }
  }, []);

  const purchaseItems = async ({
    product,
    user,
    atHome,
    amount,
  }: PurchaseProps) => {
    const add = await axios.post(
      `/db/${atHome === 0 ? "add-item" : "update-item-quantity"}`,
      {
        product: product,
        owner: user,
        quantity: amount,
      }
    );
    if (add.data) {
      if (add.data.warningStatus == 0) {
        refreshFridgeContext();
        return { message: "Successfully Added!" };
      } else {
        return { message: "Something went wrong!" };
      }
    }
  };

  const manageItems = async ({
    product,
    user,
    atHome,
    amount,
  }: ManageProps) => {
    const add = await axios.post(
      `/db/${atHome + amount == 0 ? "delete-item" : "update-item-quantity"}`,
      {
        product: product,
        owner: user,
        quantity: amount,
      }
    );
    if (add.data) {
      if (add.data.warningStatus == 0) {
        refreshFridgeContext();
        return { message: "Successfully used/tossed!" };
      } else {
        return { message: "Something went wrong!" };
      }
    }
  };

  function getUserData() {
    return fridgeItems;
  }

  return (
    <FridgeContext.Provider
      value={{
        getUserData,
        purchaseItems,
        fridgeItems,
        manageItems,
      }}
    >
      {children}
    </FridgeContext.Provider>
  );
}
