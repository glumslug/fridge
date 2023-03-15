import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { ingredient, recipe } from "../utilities/interfaces";
import Fraction from "fraction.js";
import { useAuth } from "../context/AuthContext";

type RecipeDetailsProps = {
  recipe: recipe;
  setView: (arg0: string) => void;
};
const RecipeDetails = ({ recipe, setView }: RecipeDetailsProps) => {
  // console.log(recipe);
  // GET recipe details via axios, select recipes, join ingredients, products, and units?=> shouldn't units just be strings?
  const id = recipe.recipe_id || recipe.id;
  const [recipeDetails, setRecipeDetails] = useState<ingredient[] | null>();
  const [edit, setEdit] = useState(false);
  const { userData } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/db/recipes/" + id);
        if (response.data) {
          setRecipeDetails(response.data);
        }
      } catch (error) {
        toast.error(JSON.stringify(error));
      }
    })();
  }, []);

  const fr = (num: number) => {
    // Convert fractions to unicode -- courtesy Nate Eagle, slightly modded
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

  const atHomeCheck = (product_id: number) => {
    let ret = false;
    userData
      ? Object.keys(userData.items).map((bin) => {
          if (userData.items[bin].find((item) => item.product == product_id))
            ret = true;
        })
      : null;
    return ret;
  };

  return (
    <>
      {/* Title */}
      <div
        style={{
          borderBottom: "2px solid #3960E8",
          marginBottom: "5px",
          width: "100%",

          color: "#71CDEA",
        }}
        className="px-1 d-flex align-items-center justify-content-between"
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
              fill-rule="evenodd"
              d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
            />
          </svg>
          {recipe.title}
        </div>
        {/* Edit button */}
        <>
          {edit ? (
            <div className="d-flex gap-2">
              <div
                className="rounded my-1 px-2 text-white bright-cancel"
                onClick={() => setEdit(false)}
              >
                Cancel
              </div>
              <div
                className="rounded my-1 px-2 text-white bright-submit"
                onClick={() => alert("save it for the judge!")}
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
      </div>
      <Container>
        {/* Header Row */}
        <Row className="mb-2" style={{ fontSize: "13px" }}>
          <Col
            xs="6"
            className="d-flex align-items-center justify-content-start"
          >
            Ingredient
          </Col>
          <Col
            xs="5"
            className="d-flex align-items-center justify-content-center"
          >
            Amount
          </Col>

          <Col
            xs="1"
            className="d-flex align-items-center justify-content-center"
          >
            Home
          </Col>
        </Row>
        {/* Ingredients */}
        {recipeDetails?.map((g: ingredient) => {
          return (
            <Row className="d-flex mb-1">
              {/* Title */}
              <Col
                style={{
                  gap: "10px",
                  padding: "1px 10px",
                  background: "#202020",
                  border: edit ? "" : "#436d92 1.5px solid",
                }}
                className={`text-nowrap shadow-lg h-33 d-flex justify-content-start align-items-center rounded ${
                  edit ? "bright-blue" : ""
                }`}
                xs="6"
              >
                {g.name}
              </Col>
              {/* Amount */}
              <Col
                xs="5"
                className="d-flex align-items-center justify-content-center"
              >
                <div
                  style={{
                    width: "70%",
                    background: "",
                    border: edit ? "" : "#69A7AB 1.5px solid",
                  }}
                  className={`px-2 d-flex align-items-center justify-content-center rounded ${
                    edit ? "bright-nb" : ""
                  }`}
                >
                  {`${g.amount == 0 ? "" : fr(g.amount)} ${
                    g.unit_short ||
                    (g.amount > 1 ? g.unit_plural : g.unit_singular)
                  }`}
                </div>
              </Col>

              {/* At Home */}
              <Col xs="1" className="d-flex justify-content-center">
                <input type="checkbox" checked={atHomeCheck(g.product_id)} />
              </Col>
            </Row>
          );
        })}
      </Container>
    </>
  );
};

export default RecipeDetails;
