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
      unit_short: "oz",
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
      unit_short: "Tbs",
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
    <div
      className="d-flex align-items-start justify-content-center flex-column"
      style={{ minHeight: "80vh" }}
    >
      <div className="w-100 d-flex flex-column flex-lg-row ">
        <div className="d-flex flex-column gap-2 leftSide lpShout">
          <h1 className="d-flex align-items-center justify-content-start gap-3 siteTitle">
            <span className="spanYN" style={{ fontWeight: "bolder" }}>
              The Fridge
            </span>{" "}
            <svg
              className="pink-fill"
              width="35px"
              height="35px"
              viewBox="0 -10 50 60"
              fill="none"
              stroke="none"
            >
              <path d="M10 0C8.355469 0 7 1.355469 7 3L7 18.6875C6.941406 18.882813 6.941406 19.085938 7 19.28125L7 44C7 45.644531 8.355469 47 10 47L10 48C10 49.09375 10.90625 50 12 50L15 50C16.09375 50 17 49.09375 17 48L17 47L33 47L33 48C33 49.09375 33.90625 50 35 50L38 50C39.09375 50 40 49.09375 40 48L40 47C41.644531 47 43 45.644531 43 44L43 19.1875C43.027344 19.054688 43.027344 18.914063 43 18.78125L43 3C43 1.355469 41.644531 0 40 0 Z M 10 2L40 2C40.5625 2 41 2.4375 41 3L41 18L9 18L9 3C9 2.4375 9.4375 2 10 2 Z M 13.90625 5.96875C13.863281 5.976563 13.820313 5.988281 13.78125 6C13.316406 6.105469 12.988281 6.523438 13 7L13 14C12.996094 14.359375 13.183594 14.695313 13.496094 14.878906C13.808594 15.058594 14.191406 15.058594 14.503906 14.878906C14.816406 14.695313 15.003906 14.359375 15 14L15 7C15.011719 6.710938 14.894531 6.433594 14.6875 6.238281C14.476563 6.039063 14.191406 5.941406 13.90625 5.96875 Z M 9 20L41 20L41 44C41 44.5625 40.5625 45 40 45L10 45C9.4375 45 9 44.5625 9 44 Z M 13.90625 22.96875C13.863281 22.976563 13.820313 22.988281 13.78125 23C13.316406 23.105469 12.988281 23.523438 13 24L13 31C12.996094 31.359375 13.183594 31.695313 13.496094 31.878906C13.808594 32.058594 14.191406 32.058594 14.503906 31.878906C14.816406 31.695313 15.003906 31.359375 15 31L15 24C15.011719 23.710938 14.894531 23.433594 14.6875 23.238281C14.476563 23.039063 14.191406 22.941406 13.90625 22.96875 Z M 12 47L15 47L15 48L12 48 Z M 35 47L38 47L38 48L35 48Z" />
            </svg>
          </h1>
          <h2
            className="spanTitle p-2 subTitle"
            style={{
              fontWeight: "bolder",
            }}
          >
            Recipe book, shopping list, & home inventory system &#8212; all in
            one.
          </h2>
          <div className="bg-black rounded d-flex align-items-center justify-content-center p-2 pt-3 mt-2 slideContainer">
            {" "}
            <Container className="slideText">
              <h4>Create Recipes</h4>
              <h4>Turn them into shopping lists</h4>
              <h4>Keep track of what you have</h4>
            </Container>
          </div>
          <button
            onClick={() => navigate("/register")}
            className=" d-flex justify-content-center align-items-center p-2 rounded bright my-2 mb-2 cta"
          >
            <span>Get Started</span>
          </button>
        </div>

        <div className="slide-down leftSide">
          <div className="slide-card w-100">
            {/* Recipe Details */}
            <div
              style={{
                gap: "4px",

                maxWidth: "40rem",
                minHeight: "23rem",
                maxHeight: "23rem",
              }}
              className="d-flex flex-wrap justify-content-between subCard"
            >
              <div
                id="stockBox"
                style={{
                  overflow: "hidden",
                  border: "2px solid #3960E8",
                  maxWidth: "40rem",
                  background: "#141414",
                  gap: "12px",
                  boxSizing: "border-box",
                }}
                className="shadow-lg position-relative p-2 w-100 rounded d-flex flex-column align-items-start "
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
              style={{
                gap: "4px",
                maxWidth: "40rem",
                minHeight: "23rem",
                maxHeight: "23rem",
              }}
              className="d-flex flex-wrap justify-content-between subCard"
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
                  boxSizing: "border-box",
                }}
                className="shadow-lg position-relative p-2 w-100 rounded d-flex flex-column align-items-start "
              >
                {bins.map((bin, i) => {
                  return (
                    <div key={bin} className=" w-100">
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
                className=" d-flex justify-content-between flex-nowrap"
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
              style={{
                gap: "4px",
                maxWidth: "40rem",
                minHeight: "23rem",
                maxHeight: "23rem",
              }}
              className="d-flex flex-wrap justify-content-between subCard"
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
                  boxSizing: "border-box",
                }}
                className="shadow-lg pb-0 position-relative p-2 w-100 rounded d-flex flex-column align-items-start "
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
                                  <span className="text-nowrap">
                                    {item.unit}
                                  </span>
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
      </div>
    </div>
  );
};

export default LandingPage;
