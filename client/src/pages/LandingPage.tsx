import React, { useState } from "react";
import FridgeHome from "/FridgeHome.png";
import FridgeRecipeDetails from "/FridgeRecipeDetails.png";
import FridgeShoppingList from "/FridgeShoppingList.png";
import { Button, Container, Card, Row } from "react-bootstrap";
import { cart_item, item_generic } from "../utilities/interfaces";
import DetailsDisplayRow from "../components/detailsDisplayRow";
import { ingredientList } from "../components/RecipeDetails";
import { useNavigate } from "react-router-dom";

type item = {
  bin: string;
  name: string;
  checked: boolean;
  quantity: number;
  unit: string;
};

export interface ingredientListDisp {
  ingredient_id: number;
  product_id: number;
  name: string;
  amount: number;
  stockStatus: string;
  unit_short: string;
  unit_singular: string;
  unit_plural: string;
}

type itemLP = {
  id: number;
  bin: string;
  name: string;
  unit: string;
  product: number;
  quantity: number;
};

const LandingPage = () => {
  const [reel, setReel] = useState(1);
  setTimeout(() => {
    if (reel < 3) setReel(reel + 1);
    else setReel(1);
  }, 5000);
  const navigate = useNavigate();

  const bins: string[] = ["freezer", "fridge", "pantry"];
  const binCart: item[][] = [
    [
      {
        bin: "freezer",
        name: "Shrimp",
        checked: false,
        quantity: 5,
        unit: "cup",
      },
      {
        bin: "freezer",
        name: "Ice Cream",
        checked: true,
        quantity: 5,
        unit: "cup",
      },
    ],
    [
      {
        bin: "fridge",
        name: "Butter",
        checked: true,
        quantity: 2,
        unit: "cup",
      },
      {
        bin: "fridge",
        name: "Chili Oil",
        checked: false,
        quantity: 20,
        unit: "fl-oz",
      },
    ],
    [{ bin: "pantry", name: "Flour", checked: true, quantity: 6, unit: "cup" }],
  ];
  const recipeDetails: ingredientListDisp[] = [
    {
      ingredient_id: 8,
      product_id: 11,
      name: "Spaghetti",
      amount: 9.125,
      stockStatus: "status-green",
      unit_short: "fl-oz",
      unit_singular: "fluid ounce",
      unit_plural: "fluid ounces",
    },
    {
      ingredient_id: 9,
      product_id: 12,
      name: "Garlic",
      amount: 5,
      stockStatus: "status-green",
      unit_short: "Tbs",
      unit_singular: "tablespoon",
      unit_plural: "tablespoons",
    },
    {
      ingredient_id: 10,
      product_id: 1,
      name: "Butter",
      amount: 2.125,
      stockStatus: "status-orange",
      unit_short: "fl-oz",
      unit_singular: "fluid ounce",
      unit_plural: "fluid ounces",
    },
    {
      ingredient_id: 11,
      product_id: 13,
      name: "Chili Oil",
      amount: 1,
      stockStatus: "status-grey",
      unit_short: "Tbs",
      unit_singular: "tablespoon",
      unit_plural: "tablespoons",
    },
    {
      ingredient_id: 12,
      product_id: 14,
      name: "Soy Sauce",
      amount: 2,
      stockStatus: "status-blue",
      unit_short: "Tbs",
      unit_singular: "tablespoon",
      unit_plural: "tablespoons",
    },
    {
      ingredient_id: 13,
      product_id: 15,
      name: "Chives",
      amount: 0.333333,
      stockStatus: "status-grey",
      unit_short: "cup",
      unit_singular: "cup",
      unit_plural: "cups",
    },
  ];
  const homeItems: itemLP[] = [
    {
      id: 44,
      bin: "pantry",
      name: "Pepper",
      unit: "oz",
      product: 8,
      quantity: 5,
    },
    {
      id: 53,
      bin: "fridge",
      name: "Butter",
      unit: "cup",
      product: 3,
      quantity: 3,
    },
    {
      id: 54,
      bin: "fridge",
      name: "Juice",
      unit: "fl-oz",
      product: 2,
      quantity: 12,
    },
    {
      id: 61,
      bin: "pantry",
      name: "Spaghetti",
      unit: "oz",
      product: 11,
      quantity: 10,
    },

    {
      id: 67,
      bin: "freezer",
      name: "Cherries",
      unit: "cup",
      product: 3,
      quantity: 1,
    },
  ];
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
  return (
    <div>
      <h1
        style={{
          borderBottom: "1.5px #8bbff0 solid",
          maxWidth: "40rem",
          paddingBottom: "5px",
        }}
        className="d-flex align-items-end justify-content-between"
      >
        <span className="spanYN">The Fridge</span>
        <span className="spanTitle" style={{ fontSize: "14px" }}>
          A Kitchen Inventory App
        </span>
      </h1>

      <Container className="slideText">
        <h4>Create Recipes</h4>
        <h4>Turn them into shopping lists</h4>
        <h4>Keep track of what you have</h4>
      </Container>
      <div className="slide-down">
        <div className="slide-card w-100">
          {/* Recipe Details */}
          <div
            style={{ gap: "4px", maxWidth: "40rem", height: "55vh" }}
            className="d-flex flex-wrap justify-content-between"
          >
            <div
              id="stockBox"
              style={{
                minHeight: "7rem",
                // maxHeight: "20rem",

                overflow: "hidden",
                border: "2px solid #3960E8",
                maxWidth: "40rem",
                background: "#141414",
                gap: "12px",
              }}
              className="shadow-lg mt-3 position-relative p-2 w-100 rounded d-flex flex-column align-items-start "
            >
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
                <div
                  className="px-1 d-flex align-items-center"
                  style={{ gap: "15px" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="white"
                    className="bi bi-arrow-left-circle bright-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
                    />
                  </svg>
                  Garlic Noodles
                </div>
                {/* Edit button */}

                <>
                  <div className="rounded my-1 px-2 text-white bright-orange">
                    Edit
                  </div>
                </>
              </div>

              {/* Ingredients List */}

              <DetailsDisplayRow
                ingredients={recipeDetails}
                fractionize={fractionize}
              />

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
                      <span className="legend text-nowrap">
                        {" "}
                        in cart &#8205;
                      </span>
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

                <div className="d-flex gap-1">
                  <div
                    className="rounded my-1 p-1 px-3 text-white bright-orange"
                    style={{ maxHeight: "2.3rem" }}
                  >
                    Shop
                  </div>

                  <div
                    className="rounded my-1 p-1 px-3 text-white bright-submit2"
                    style={{ maxHeight: "2.3rem" }}
                  >
                    Cook
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Shop */}
          <div
            style={{ gap: "4px", maxWidth: "40rem", height: "55vh" }}
            className="d-flex flex-wrap justify-content-between"
          >
            <div
              id="stockBox"
              style={{
                minHeight: "7rem",
                overflowY: "scroll",
                border: "2px solid #3960E8",
                maxWidth: "40rem",
                background: "#141414",
                gap: "12px",
              }}
              className="shadow-lg mt-3 mx-1 position-relative p-2 w-100 rounded d-flex flex-column align-items-start "
            >
              {bins.map((bin, i) => {
                return (
                  <div key={bin} className="px-1 w-100">
                    {/* Bin title */}

                    {binCart[i].length > 0 && (
                      <div
                        style={{
                          borderBottom: "2px solid #A1D3FF",
                          marginBottom: "5px",
                        }}
                      >
                        {bin.charAt(0).toUpperCase() + bin.slice(1)}
                      </div>
                    )}

                    {/* Bin items */}
                    <div className="g-0 masonry-with-columns">
                      {binCart[i].length > 0 &&
                        binCart[i].map((item: item, i: number) => {
                          return (
                            <div
                              className="py-1 d-flex align-items-center masonry-div"
                              style={{
                                gap: "3px",
                                marginBottom: "5px",
                              }}
                              key={`${bin}${i}`}
                            >
                              <label htmlFor={`${bin}${i}`}>
                                <Card
                                  style={{
                                    background: "black",
                                    gap: "5px",
                                    padding: "3px 2px 3px 8px",
                                  }}
                                  className="w-100 item-bright shadow-lg h-33 d-flex flex-row justify-content-between align-items-center flex-nowrap "
                                >
                                  <input
                                    type="checkbox"
                                    id={`${bin}${i}`}
                                    checked={item.checked}
                                    style={{ accentColor: "#df5296" }}
                                  />

                                  <div className="text-nowrap cart-check">
                                    {item.name}
                                  </div>
                                  <div className="bkg-maroon d-flex text-center rounded px-1 gap-1">
                                    <span>{item.quantity}</span>
                                    <span className="text-nowrap">
                                      {item.unit}
                                    </span>
                                  </div>
                                </Card>
                              </label>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                maxWidth: "40rem",
                width: "40rem",
                gap: "5px",
              }}
              className="mx-1 d-flex justify-content-between flex-nowrap"
            >
              {/* Product search */}
              <div className="p-0 w-100">
                <div
                  aria-label="Default"
                  aria-describedby="inputGroup-sizing-default"
                  className="d-flex align-items-center py-0 bg-transparent border-1 border-black rounded"
                  style={{
                    border: "2px solid #5b5b5b",
                    height: "2.4rem",
                    background: "#202020",
                    padding: "2px 10px",
                    color: "grey",
                  }}
                >
                  Add Items...
                </div>
              </div>
              <Button
                variant="outline-dark"
                style={{
                  width: "auto",
                  height: "2.4rem",
                  border: "2px solid #705151",
                  color: "white",
                  flexShrink: "1",
                }}
              >
                Checkout
              </Button>
            </div>
          </div>
          {/* Home */}
          <div
            style={{ gap: "4px", maxWidth: "40rem", height: "55vh" }}
            className="d-flex flex-wrap justify-content-between"
          >
            <div
              id="stockBox"
              style={{
                minHeight: "7rem",
                overflowY: "scroll",
                border: "2px solid #3960E8",
                maxWidth: "40rem",
                background: "#141414",
                gap: "2px",
              }}
              className="shadow-lg mt-3 pb-0 mx-1 position-relative py-2 ps-2 w-100 rounded d-flex flex-column align-items-start "
            >
              <div className="p-0 w-100">
                <div
                  aria-label="Default"
                  aria-describedby="inputGroup-sizing-default"
                  className="d-flex align-items-center py-0 bg-transparent border-1 border-black rounded"
                  style={{
                    border: "2px solid #5b5b5b",
                    height: "2rem",
                    background: "#202020",
                    padding: "2px 10px",
                    color: "grey",
                  }}
                >
                  Add Items...
                </div>
              </div>
              <div className="w-100 d-flex flex-column align-items-center">
                {bins.map((bin) => {
                  return (
                    <div
                      style={{
                        minHeight: "1rem",
                        border: "1.5px #AAAAAA solid",
                        // borderColor: "#3960E8",
                        maxWidth: "40rem",
                        background: "#141414",
                        gap: "12px",
                      }}
                      className="shadow-lg my-2 position-relative pt-5 p-2 w-100 rounded g-0 masonry-with-columns"
                    >
                      {/* Name and filter */}
                      <div
                        style={{
                          transform: "translate(-.4rem, -0.4rem)",
                          border: "1.5px #AAAAAA solid",
                          background: "#1b1a1a",
                          padding: "2px 6px",
                          width: "auto",
                          gap: "7px",
                        }}
                        className="position-absolute top-0 end-0 d-flex flex-row justify-content-between align-items-center"
                      >
                        {/* Name plaque */}
                        <div>{bin}</div>
                      </div>
                      {homeItems?.map((item, i) => {
                        if (item.bin === bin) {
                          return (
                            <Card
                              style={{
                                width: "auto",
                                background: "black",
                                // border: "#6ba2d5 1.5px solid",
                                gap: "10px",
                                padding: "3px 8px",
                              }}
                              className="item-bright shadow-lg h-33 d-flex flex-row justify-content-between align-items-center"
                            >
                              <div>{item.name}</div>
                              <div
                                style={{ background: "#AB6969" }}
                                className="d-flex text-center rounded px-1 gap-1"
                              >
                                <span>{item.quantity}</span>
                                <span className="text-nowrap">{item.unit}</span>
                              </div>
                            </Card>
                          );
                        }
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="d-flex align-items-center justify-content-center w-100 mt-4 gap-3"
        style={{ maxWidth: "40rem" }}
      >
        <button
          onClick={() => navigate("/login")}
          className="d-flex justify-content-center p-2 w-50 rounded bright-submit text-white"
          style={{ background: "none" }}
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="d-flex justify-content-center p-2 w-50 rounded item-bright text-white"
          style={{ background: "none" }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
