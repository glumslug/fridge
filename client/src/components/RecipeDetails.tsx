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
import conversionMachine from "../utilities/conversionMachine";
import { Unit } from "convert-units";

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
  unit: number;
  unit_short: Unit;
  unit_singular: string;
  unit_plural: string;
  stockStatus: string;
  editStatus: string | null;
}

type BodyUl = { name: string; amount: number; unit: Unit };
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

type upsert = {
  amount: number;
  product: number;
  unit: Unit;
};

type downsert = {
  amount: number;
  product: number;
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
  const [checkoutArray, setCheckoutArray] = useState<upsert[]>([]);
  const [checkoutModal, setCheckoutModal] = useState<BodyUl[]>([]);
  const [edit, setEdit] = useState(false);
  const {
    userData,
    upsertCart,
    downsertItem,
    manageSavedRecipes,
    deleteRecipe,
    editRecipe,
    refreshContext,
  } = useAuth();
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
            console.log(response.data);
            let statusArray: ingredientList[] = [];
            let missingArray: upsert[] = [];
            let modalArray: BodyUl[] = [];
            response.data.map((ingredient: ingredient) => {
              let homeItem = userData.items.find(
                (item) => item.product == ingredient.product_id
              );
              let cartItem = userData.cart.find(
                (item) => item.product == ingredient.product_id
              );
              // express home item in ingredient units
              let x_home = conversionMachine({
                source: homeItem?.unit,
                target: ingredient?.unit_short,
                amount: homeItem?.quantity || 0,
              });

              // express cart item in ingedient units
              let x_cart = conversionMachine({
                source: cartItem?.unit,
                target: ingredient?.unit_short,
                amount: cartItem?.quantity || 0,
              });
              console.table({ homeItem, cartItem, x_home, x_cart });
              let stockStatus;
              let newAmount;
              let newUnit;
              if (homeItem === undefined && cartItem === undefined) {
                stockStatus = "status-grey";
                newAmount = ingredient.amount;
                newUnit = ingredient.unit_short;
              } else if (x_home >= ingredient.amount) {
                stockStatus = "status-green";
              } else if (x_home + x_cart >= ingredient.amount) {
                stockStatus = "status-blue";
              } else {
                stockStatus = "status-orange";
                // condition 1: in cart, not enough, not at home
                if (homeItem === undefined && cartItem !== undefined) {
                  newAmount =
                    conversionMachine({
                      target: cartItem.unit,
                      source: ingredient.unit_short,
                      amount: ingredient.amount,
                    }) - cartItem.quantity;

                  newUnit = cartItem.unit;
                }
                // condition 2: at home, not enough, not in cart
                if (cartItem === undefined && homeItem !== undefined) {
                  newAmount =
                    conversionMachine({
                      target: homeItem.unit,
                      source: ingredient.unit_short,
                      amount: ingredient.amount,
                    }) - homeItem.quantity;

                  newUnit = homeItem.unit;
                }
                // condition 3: at home, in cart, not enough
                if (homeItem !== undefined && cartItem !== undefined) {
                  // convert all to cartUnits, amount = ingredient(cartUnit) - homeItem(cartUnit) - cartItem
                  newAmount =
                    conversionMachine({
                      target: cartItem.unit,
                      source: ingredient.unit_short,
                      amount: ingredient.amount,
                    }) -
                    conversionMachine({
                      target: cartItem.unit,
                      source: homeItem.unit,
                      amount: homeItem.quantity,
                    }) -
                    cartItem.quantity;

                  newUnit = cartItem.unit;
                }
              }

              let tempStatus: ingredientList = {
                ...ingredient,
                stockStatus: stockStatus,
                editStatus: null,
              };
              statusArray.push(tempStatus);

              if (newAmount !== undefined && newUnit !== undefined) {
                missingArray.push({
                  amount: newAmount,
                  product: ingredient.product_id,
                  unit: newUnit,
                });
                modalArray.push({
                  name: ingredient.name,
                  amount: ingredient.amount,
                  unit: ingredient.unit_short,
                });
              }
            });

            setIngredients(statusArray);
            setTempIngredients(statusArray);
            setCheckoutArray(missingArray);
            setCheckoutModal(modalArray);
            console.log("Refreshed recipe details");
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
      .replace(/\b1\/3|0?\.333|0?\.33\b/, "⅓")
      .replace(/\b2\/3|0?\.666|0?\.66\b/, "⅔")
      .replace(/\b1\/8|0?\.125|0?\.12\b/, "⅛");
    return str;
  };

  // add missing items to cart
  const handleAdd = async () => {
    await Promise.all(
      checkoutArray.map(async (g) => {
        let res = await upsertCart({
          product: g.product,
          amount: g.amount,
          unit: g.unit,
        });
      })
    );
    refreshContext("purchase");
    toast.success(`Successfully added ${checkoutArray.length} items.`);
    setModal({ ...modal, show: false });
  };

  // sets modal for shopping for items
  const handleShop = () => {
    checkoutModal.length > 0
      ? setModal({
          show: true,
          message: { title: "Add items to cart?", body: { ul: checkoutModal } },
          action: () => handleAdd(),
        })
      : toast.error("All items already in cart/at home!");
  };

  // dummy function
  const handleCook = () => {
    // loop through ingredients, convert to homeUnits, downsert amount
    const cookRecipe = () => {
      if (!userData || !ingredients) return;
      let downsertItems: downsert[] = [];
      let complete = true;
      ingredients.map(async (g) => {
        let homeItem = userData.items.find(
          (item) => item.product == g.product_id
        );
        if (homeItem === undefined) {
          complete = false;
          return;
        }
        let x_home = conversionMachine({
          source: g.unit_short,
          target: homeItem.unit,
          amount: g.amount,
        });
        downsertItems.push({ product: g.product_id, amount: x_home });
      });
      if (complete) {
        Promise.all(
          downsertItems.map(async (item) => {
            await downsertItem(item);
          })
        );
        setModal(emptyModal);
        refreshContext();
        toast.success("Cooked recipe! Ingredients consumed.");
      } else {
        setModal(emptyModal);
        toast.error("You don't have all necessary ingredients at Home!");
      }
    };
    setModal({
      show: true,
      message: {
        title: "Cook this recipe?",
        body: {
          pre: "All ingredients associated with ",
          span: recipe.title,
          post: " will be consumed.",
        },
      },
      action: cookRecipe,
    });
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
    let updateG = tempIngredients?.filter((g) => g.editStatus === "update");
    let deleteG = tempIngredients?.filter((g) => g.editStatus === "delete");
    let newG = tempIngredients?.filter((g) => g.editStatus === "new");
    if (newG?.some((g) => g.unit_singular === undefined)) {
      toast.error("Please add units for all items!");
      return;
    }
    if (updateG !== undefined && updateG?.length > 0) {
      editRecipe({ action: "update", ingredients: updateG, recipe: id });
    }
    if (deleteG !== undefined && deleteG?.length > 0) {
      editRecipe({ action: "delete", ingredients: deleteG, recipe: id });
    }
    if (newG !== undefined && newG?.length > 0) {
      editRecipe({ action: "new", ingredients: newG, recipe: id });
    }
    setEdit(false);
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
