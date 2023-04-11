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
  recipe,
  cuisines,
  units,
} from "../utilities/interfaces";
import { useNavigate } from "react-router-dom";
import YesNoModal from "../components/YesNoModal";
import { ingredientList } from "../components/RecipeDetails";
import { Unit } from "convert-units";

type credentials = {
  email: string;
  password: string;
  name?: string;
};

type CRUD = {
  product: number;
  atHome?: number;
  amount: number;
  unit: Unit;
  action?: string;
};

type downsertItem = {
  product: number;
  amount: number;
};

type CreateRecipeProps = {
  title: string;
  cuisine: number | null;
  source: number | null;
};

type AuthProviderProps = {
  children: ReactNode;
};

type notSelect = {
  message?: string;
  insertId?: number;
};

type createRecipeReturn = {
  message?: string;
  data?: recipe;
};

type editRecipeProps = {
  action: string;
  ingredients: ingredientList[];
  recipe: number;
};

type createProductReturn = {
  message?: string;
  data?: productSearchItem;
};

type CreateProductProps = {
  name: string;
  bin: string;
};

type AuthContext = {
  userData: userData | null;
  basketData: basketData | null;
  units: units[] | null;
  cuisines: cuisines[] | null;
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
  }: CRUD) => Promise<notSelect | undefined>;
  manageBasket: ({ product, amount, action }: CRUD) => void;
  upsertItem: ({
    product,
    amount,
    unit,
  }: CRUD) => Promise<notSelect | undefined>;
  upsertCart: ({
    product,
    amount,
    unit,
  }: CRUD) => Promise<notSelect | undefined>;
  downsertItem: ({
    product,
    amount,
  }: downsertItem) => Promise<notSelect | undefined>;
  createRecipe: ({
    title,
    cuisine,
    source,
  }: CreateRecipeProps) => Promise<createRecipeReturn | undefined>;
  createProduct: ({
    name,
    bin,
  }: CreateProductProps) => Promise<createProductReturn | undefined>;
  deleteRecipe: (id: number) => Promise<notSelect | undefined | boolean>;
  manageSavedRecipes: (
    id: number,
    action: string
  ) => Promise<notSelect | undefined>;
  editRecipe: ({ action, ingredients }: editRecipeProps) => void;
};
export const AuthContext = createContext({} as AuthContext);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [userData, setUserData] = useState<userData | null>(null);
  const [basketData, setBasketData] = useState<basketData | null>(null);
  const [units, setUnits] = useState<units[] | null>(null);
  const [cuisines, setCuisines] = useState<cuisines[] | null>(null);
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
      if (action == "purchase") {
        localStorage.removeItem("basket");
        setBasketData(null);
      }
      return { message: "Refreshed successfully." };
    }
  };

  // get static lists: cuisines, units
  useEffect(() => {
    const getCuisines = async () => {
      const cuisineList = await axios.get("/db/cuisines");
      if (cuisineList.data) {
        setCuisines(cuisineList.data);
      }
    };
    getCuisines();
    const getUnits = async () => {
      const unitList = await axios.get("/db/units");
      if (unitList.data) {
        setUnits(unitList.data);
      }
    };
    getUnits();
  }, []);

  const loginUser = async ({ email, password }: credentials) => {
    localStorage.removeItem("user");
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

  // downsert item -- for use/toss items in home tab and Cook function in recipes
  const downsertItem = async ({ product, amount }: downsertItem) => {
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
  const manageCart = async ({ product, amount, action, unit }: CRUD) => {
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
        unit: unit,
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

  const manageBasket = ({ product, amount, action, unit }: CRUD) => {
    // This is for when you're shopping, adding things to your purchase order
    const localBasket = localStorage.getItem("basket");
    const basket = localBasket ? JSON.parse(localBasket) : { items: [] };
    let index = basket.items.findIndex(
      (item: basketItem) => item.product == product
    );
    switch (action) {
      case "add":
        basket.items.push({ product, amount, unit });
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
        basket.items[index].unit = unit;
        localStorage.setItem("basket", JSON.stringify(basket));
        break;
      default:
        break;
    }
  };

  const upsertItem = async ({ product, amount, unit }: CRUD) => {
    const add = await axios.post(`/db/upsertItem`, {
      product: product,
      owner: userData?.id,
      quantity: amount,
      unit: unit,
    });
    if (add.data) {
      return { message: "Successfully upserted item." };
      // refreshContext("purchase");
    } else {
      return { message: "Something went wrong!" };
    }
  };

  const upsertCart = async ({ product, amount, unit }: CRUD) => {
    const add = await axios.post("/db/upsertCart", {
      product: product,
      owner: userData?.id,
      quantity: amount,
      unit: unit,
    });

    if (add.data) {
      return { message: "Successfully added cart item." };
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

  //create recipe
  const createRecipe = async ({
    title,
    cuisine,
    source,
  }: CreateRecipeProps) => {
    // action is add, remove, or update
    const add = await axios({
      url: "/db/recipes/create",
      method: "POST",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
        "Content-Type": "application/json",
      },
      data: {
        title,
        cuisine,
        source,
      },
    });
    if (add.data) {
      toast.success("Recipe created!");
      refreshContext();

      return { data: add.data[0] };
    } else {
      return { message: "Something went wrong!" };
    }
  };

  //create product
  const createProduct = async ({ name, bin }: CreateProductProps) => {
    const add = await axios({
      url: "/db/products/create",
      method: "POST",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
        "Content-Type": "application/json",
      },
      data: {
        name,
        bin,
      },
    });
    if (add.data) {
      toast.success("Product created!");
      return { data: add.data[0] };
    } else {
      return { message: "Something went wrong!" };
    }
  };

  //delete a recipe
  const deleteRecipe = async (id: number) => {
    const del = await await axios({
      url: "/db/recipes/" + id,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
        "Content-Type": "application/json",
      },
    });
    if (del.data.errno) {
      toast.error("Something went wrong!");
      return false;
    } else {
      toast.success("Recipe deleted.");
      refreshContext();
      return true;
    }
  };

  const editRecipe = async ({
    action,
    ingredients,
    recipe,
  }: editRecipeProps) => {
    if (action === "update") {
      Promise.all(
        ingredients.map(async (g) => {
          const edit = await axios({
            url: "/db/recipes/edit/update",
            method: "POST",
            headers: {
              Authorization: `Bearer ${userData?.token}`,
              "Content-Type": "application/json",
            },
            data: {
              ingredient: g,
              recipe: recipe,
            },
          });
          if (edit.data) {
            return true;
          } else {
            return { message: "Something went wrong!" };
          }
        })
      ).then(() => {
        toast.success("Recipe updated!");
        refreshContext();
      });
    } else {
      const edit = await axios({
        url: "/db/recipes/edit/" + action,
        method: "POST",
        headers: {
          Authorization: `Bearer ${userData?.token}`,
          "Content-Type": "application/json",
        },
        data: {
          ingredients: ingredients,
          recipe: recipe,
        },
      });
      if (edit.data) {
        toast.success("Recipe updated!");
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
        cuisines,
        units,
        loginUser,
        registerUser,
        logoutUser,
        manageCart,
        manageBasket,
        downsertItem,
        refreshContext,
        searchProducts,
        upsertItem,
        upsertCart,
        manageSavedRecipes,
        editRecipe,
        createRecipe,
        createProduct,
        deleteRecipe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
