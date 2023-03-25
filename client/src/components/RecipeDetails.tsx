import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { ingredient, productSearchItem, recipe } from "../utilities/interfaces";
import { useAuth } from "../context/AuthContext";
import YesNoModal from "./YesNoModal";
import IngredientSearch from "./IngredientSearch";
import DetailsDisplayRow from "./detailsDisplayRow";
import DetailsEditRow from "./detailsEditRow";

type RecipeDetailsProps = {
  recipe: recipe;
  setView: (arg0: string) => void;
  myOwn: boolean;
};

export interface ingredientList {
  ingredient_id?: number | null;
  product_id: number;
  name: string;
  amount: number;
  unit_short?: string | null;
  unit_singular?: string;
  unit_plural?: string;
  stockStatus?: string;
  editStatus: string | null;
}

type BodyUl = { name: string; amount: number };
type ModalProps = {
  show: boolean;
  message: {
    title: string;
    body: { pre?: string; span?: string; post?: string; ul?: BodyUl[] };
  };
  action: () => void;
};

const emptyModal = {
  show: false,
  message: { title: "", body: { pre: "", span: "", post: "" } },
  action: () => alert("Empty"),
};

// Recipe Details strategy:

// 1. Abstract Recipe Details rows into 2 components: detailsEditRow and detailsDisplayRow
// only one data array: ingredients. Initially set in the useEffect, only changes on update context.
// Ingredients has extra fields: stockStatus (grey, green, orange, blue) and editStatus (null, altered, new, delete)
// on edit, use a second useState to control the unsaved data (initial state is recipe array), on cancel, it will revert back to the ingredients values
// on Save, filter the array for altered and new and feed it to an upsert function in authcontext

// Optional: Organize components directory into folders for easy access || organize all into pages, with sub components folders, and leave common components in components folder

const RecipeDetails = ({ recipe, setView, myOwn }: RecipeDetailsProps) => {
  const id = recipe.id;
  const [ingredients, setIngredients] = useState<ingredientList[] | null>();
  const [tempIngredients, setTempIngredients] = useState<
    ingredientList[] | null
  >();
  const [edit, setEdit] = useState(false);
  const { userData, bulkCartAdd, manageSavedRecipes, deleteRecipe } = useAuth();
  const mySaved = userData?.savedRecipes.some((rec) => rec.id == recipe.id);
  const [modal, setModal] = useState<ModalProps>(emptyModal);
  const userId = userData?.id;

  // GET recipe details
  // PUSH to new array, assign STATUS based on if in cart, home, or none
  // set the stock variable to this array
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/db/recipes/" + id);
        if (response.data) {
          if (userData) {
            let arr: ingredientList[] = [];
            response.data.map((ingredient: ingredient) => {
              let stockStatus = userData.items.some(
                (item) => item.product == ingredient.product_id
              )
                ? "status-green"
                : userData.cart.some(
                    (item) => item.product == ingredient.product_id
                  )
                ? "status-blue"
                : "status-grey";
              let temp: ingredientList = {
                ...ingredient,
                stockStatus: stockStatus,
                editStatus: null,
              };
              arr.push(temp);
            });
            setIngredients(arr);
            setTempIngredients(arr);
          }
        }
      } catch (error) {
        toast.error(JSON.stringify(error));
      }
    })();
  }, [userData]);

  // Convert fractions to unicode -- courtesy Nate Eagle, slightly modded
  const fractionize = (num: number) => {
    let str = num
      .toString()
      .substring(0, 5)
      .toString()
      .replace(/\b1\/2|0?\.5\b/, "½")
      .replace(/\b1\/4|0?\.25\b/, "¼")
      .replace(/\b3\/4|0?\.75\b/, "¾")
      .replace(/\b1\/3|0?\.333\b/, "⅓")
      .replace(/\b2\/3|0?\.666\b/, "⅔")
      .replace(/\b1\/8|0?\.125\b/, "⅛");
    return str;
  };

  // CONFUSING! refactor
  const handleShop = (add?: boolean) => {
    // [[owner, product, quantity]]
    // This is going to mess up if item is already in cart, I should create an upsert,
    if (!userId) return;
    let arr: number[][] = [];
    let body: BodyUl[] = [];
    ingredients?.map((g) => {
      if (g.stockStatus == "status-grey") {
        arr.push([userId, g.product_id, g.amount]);
        body.push({ name: g.name, amount: g.amount });
      }
    });
    const handleAdd = () => {
      bulkCartAdd({ values: arr });
      setModal({ ...modal, show: false });
    };
    add
      ? handleAdd()
      : body.length > 0
      ? setModal({
          ...modal,
          show: true,
          message: { title: "Add items to cart?", body: { ul: body } },
          action: () => handleShop(true),
        })
      : toast.error("All items already in cart/at home!");
  };

  // dummy function
  const handleCook = () => {
    alert("Bookum");
  };

  // sets modal to save a recipe
  const saveRecipe = () => {
    setModal({
      show: true,
      message: {
        title: "Save recipe?",
        body: {
          pre: "Save ",
          span: recipe.title,
          post: " to your Saved Recipes list?",
        },
      },
      action: () => handleSave(),
    });
  };

  // modal calls this function to save recipe
  const handleSave = () => {
    setModal(emptyModal);
    manageSavedRecipes(id, "save");
    setView("overview");
  };

  // sets modal to remove a recipe
  const removeSaved = () => {
    setModal({
      show: true,
      message: {
        title: "Remove recipe?",
        body: {
          pre: "Remove ",
          span: recipe.title,
          post: " from your Saved Recipes list?",
        },
      },
      action: () => handleRemove(),
    });
  };

  // modal calls this function to remove recipe
  const handleRemove = () => {
    setModal(emptyModal);
    manageSavedRecipes(id, "remove");
    setView("overview");
  };

  // dummy function
  const modifyRecipe = () => {
    alert("Convert this to my recipe and modify?");
  };

  //delete a recipe
  const handleDeleteRecipe = async () => {
    setModal({
      show: true,
      message: {
        title: "Delete recipe?",
        body: {
          pre: "Delete ",
          span: recipe.title,
          post: " forever?",
        },
      },
      action: () => executeDeleteRecipe(),
    });
  };
  const executeDeleteRecipe = async () => {
    const del = await deleteRecipe(id);
    if (del) {
      setView("overview");
    } else {
      return;
    }
  };

  const handleSaveEdits = () => {
    // upsertIngredients(newIngredients)
  };

  const handleCancelEdits = () => {
    setTempIngredients(ingredients);
    setEdit(false);
  };

  return (
    <>
      <YesNoModal
        show={modal.show}
        message={modal.message}
        handleAction={modal.action}
        handleClose={() => setModal(emptyModal)}
      />

      {/* Title Row */}
      <div
        style={{
          borderBottom: "2px solid #3960E8",
          marginBottom: "5px",
          width: "100%",

          color: "#71CDEA",
        }}
        className=" d-flex align-items-center justify-content-between"
      >
        <div className="px-1 d-flex align-items-center" style={{ gap: "15px" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="white"
            className="bi bi-arrow-left-circle bright-fill"
            viewBox="0 0 16 16"
            onClick={() => setView("overview")}
          >
            <path
              fillRule="evenodd"
              d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
            />
          </svg>
          {recipe.title}
        </div>
        {/* Edit button */}
        {myOwn ? (
          <>
            {edit ? (
              <div className="d-flex gap-2">
                <div
                  className="rounded my-1 px-2 text-white bright-cancel"
                  onClick={handleCancelEdits}
                >
                  Cancel
                </div>

                <div
                  className="rounded my-1 px-2 text-white bright-submit"
                  onClick={() => handleSaveEdits()}
                >
                  Save
                </div>
              </div>
            ) : (
              <div
                className="rounded my-1 px-2 text-white bright-orange"
                onClick={() => setEdit(true)}
              >
                Edit
              </div>
            )}
          </>
        ) : (
          <div className="d-flex gap-2">
            <div
              className="rounded my-1 px-2 text-white bright-orange"
              onClick={modifyRecipe}
            >
              Modify
            </div>
            {mySaved ? (
              <div
                className="rounded my-1 px-2 text-white bright-orange"
                onClick={removeSaved}
              >
                Remove
              </div>
            ) : (
              <div
                className="rounded my-1 px-2 text-white bright-orange"
                onClick={saveRecipe}
              >
                Save
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ingredients List */}
      {edit ? (
        <DetailsEditRow
          tempIngredients={tempIngredients}
          setTempIngredients={setTempIngredients}
          fractionize={fractionize}
        />
      ) : (
        <DetailsDisplayRow
          ingredients={ingredients}
          fractionize={fractionize}
        />
      )}

      {/* Legend, shop/cook buttons */}
      <div
        className="mt-2 pt-1 d-flex w-100 justify-content-between"
        style={{
          borderTop: "2px solid #3960E8",
        }}
      >
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {/* No stock */}
          <div className="d-flex">
            <div
              style={{
                width: "1rem",
                height: "1rem",
                borderRadius: "3px",
                border: "1px solid black",
              }}
              className="status-grey"
            ></div>
            <span className="legend text-nowrap"> no stock</span>
          </div>
          {/* Partial */}
          <div className="d-flex">
            <div
              style={{
                width: "1rem",
                height: "1rem",
                borderRadius: "3px",
                border: "1px solid black",
              }}
              className="status-orange"
            ></div>
            <span className="legend text-nowrap"> partial </span>
          </div>
          <div className="d-flex gap-2 gap-sm-0 flex-wrap">
            {/* In Cart */}
            <div className="d-flex">
              <div
                style={{
                  width: "1rem",
                  height: "1rem",
                  borderRadius: "3px",
                  border: "1px solid black",
                }}
                className="status-blue"
              ></div>
              <span className="legend text-nowrap"> in cart &#8205;</span>
            </div>

            {/* At Home */}
            <div className="d-flex">
              <div
                style={{
                  width: "1rem",
                  height: "1rem",
                  borderRadius: "3px",
                  border: "1px solid black",
                }}
                className="status-green"
              ></div>
              <span className="legend text-nowrap"> at home </span>
            </div>
          </div>
        </div>

        {/* Shop & Cook buttons */}
        {edit ? (
          <div
            className="rounded my-1 px-2 text-white bright-orange d-flex align-items-center"
            onClick={() => handleDeleteRecipe()}
          >
            Delete
          </div>
        ) : (
          <div className="d-flex gap-1">
            <div
              className="rounded my-1 p-1 px-3 text-white bright-orange"
              style={{ maxHeight: "2.3rem" }}
              onClick={() => handleShop()}
            >
              Shop
            </div>

            <div
              className="rounded my-1 p-1 px-3 text-white bright-submit2"
              style={{ maxHeight: "2.3rem" }}
              onClick={() => handleCook()}
            >
              Cook
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RecipeDetails;
