import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { userData, foodByGroup } from "../utilities/interfaces";

type FridgeProviderProps = {
  children: ReactNode;
};

type PurchaseProps = {
  name: string;
  user: number;
  atHome: number;
  amount: number;
};

type ManageProps = {
  name: string;
  user: number;
  atHome: number;
  amount: number;
};

type Message = {
  message: string;
};

type FridgeContext = {
  getUserData: () => userData[];
  getStoreData: () => foodByGroup[];
  purchaseItems: ({
    name,
    user,
    atHome,
    amount,
  }: PurchaseProps) => Promise<Message | undefined>;
  fridgeItems: userData[];
  manageItems: ({
    name,
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
  const [storeItems, setStoreItems] = useState<foodByGroup[]>([]);
  const refreshFridgeContext = () => {
    const openFridge = async () => {
      const users = await axios.get("/db/userItems");
      if (users.data) {
        const userData: userData[] = users.data;
        localStorage.setItem("fridge", JSON.stringify(userData));
        setFridgeItems(userData);
      }
    };

    openFridge();
  };
  useEffect(() => {
    const openStore = async () => {
      const stock = await axios.get("/db/food-by-group");
      if (stock.data) {
        const foodData: foodByGroup[] = stock.data;
        localStorage.setItem("store", JSON.stringify(foodData));
        setStoreItems(foodData);
      }
    };
    openStore();
    refreshFridgeContext();
  }, []);

  const purchaseItems = async ({
    name,
    user,
    atHome,
    amount,
  }: PurchaseProps) => {
    const add = await axios.post(
      `/db/${atHome === 0 ? "add-item" : "update-item-quantity"}`,
      {
        name: name,
        owner: user,
        quantity: amount,
        bin: "Fridge",
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

  const manageItems = async ({ name, user, atHome, amount }: ManageProps) => {
    const add = await axios.post(
      `/db/${atHome + amount == 0 ? "delete-item" : "update-item-quantity"}`,
      {
        name: name,
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

  function getStoreData() {
    return storeItems;
  }

  return (
    <FridgeContext.Provider
      value={{
        getUserData,
        getStoreData,
        purchaseItems,
        fridgeItems,
        manageItems,
      }}
    >
      {children}
    </FridgeContext.Provider>
  );
}
