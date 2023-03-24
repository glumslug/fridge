import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { ingredient } from "../utilities/interfaces";
import { newIngredient, stockItem } from "./RecipeDetails";

type EditRowProps = {
  recipeDetails: ingredient[];
  fractionize: (argo0: number) => string;
  newIngredients: newIngredient[];
};

const DetailsEditRow = ({
  recipeDetails,
  fractionize,
  newIngredients,
}: EditRowProps) => {
  return (
    <Container className="me-2">
      {/* Header Row */}
      {recipeDetails?.length !== 0 ? (
        <Row className="g-0 mb-2" style={{ fontSize: "13px" }}>
          <Col xs={"1"}></Col>
          <Col
            xs={"5"}
            className="px-2 d-flex align-items-center justify-content-start"
          >
            Ingredient
          </Col>
          <Col
            xs={"3"}
            className="d-flex align-items-center justify-content-center"
          >
            Amount
          </Col>

          <Col
            xs={"3"}
            className="d-flex align-items-center justify-content-center"
          >
            Unit
          </Col>
        </Row>
      ) : null}

      {/* {edit ? <IngredientSearch handleAdd={handleAdd}/> : null} */}
      {/* Ingredients */}

      {recipeDetails?.map((g: ingredient) => {
        let newG = newIngredients.find(
          (n: newIngredient) => n.product_id == g.product_id
        );

        console.log(newG);
        return (
          <Row className="g-0 d-flex mb-1" key={g.ingredient_id}>
            {/* Title */}

            <Col xs="1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-dash-circle bright-fill-pink"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
              </svg>
            </Col>

            <Col
              style={{
                gap: "10px",
                padding: "1px 10px",
                background: "#202020",
                border: "#436d92 1.5px solid",
              }}
              className={`text-nowrap shadow-lg h-33 d-flex justify-content-start align-items-center rounded`}
              xs={"5"}
            >
              {g.name}
            </Col>
            {/* Amount */}
            <Col
              xs={"3"}
              className="d-flex align-items-center justify-content-center"
            >
              <div
                style={{
                  width: "70%",
                  background: "",
                }}
                className="px-2 d-flex align-items-center justify-content-center rounded bright-GY"
              >
                {fractionize(g.amount)}
              </div>
            </Col>
            {/* Status / unit (in edit mode) */}
            <Col
              xs={"3"}
              className="d-flex justify-content-center align-items-center"
            >
              <div
                style={{
                  width: "90%",
                  background: "",
                }}
                className="px-2 d-flex align-items-center justify-content-center rounded bright-nb"
              >
                {g.unit_short ||
                  (g.amount > 1 ? g.unit_plural : g.unit_singular)}
              </div>
            </Col>
          </Row>
        );
      })}
      {/* New Ingredients Rows */}
      {edit &&
        newIngredients?.map((g: newIngredient, i) => {
          return (
            <Row className="g-0 d-flex mb-1" key={g.product_id}>
              <Col xs="1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-dash-circle bright-fill-pink"
                  viewBox="0 0 16 16"
                  onClick={() => removeNew(i)}
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                </svg>
              </Col>
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
                xs="5"
              >
                {g.name}
              </Col>
              {/* Amount */}
              <Col
                xs={"3"}
                className="d-flex align-items-center justify-content-center"
              >
                <div
                  style={{
                    width: "70%",
                    background: "",
                    border: edit ? "" : "#69A7AB 1.5px solid",
                  }}
                  className={`px-2 d-flex align-items-center justify-content-center rounded ${
                    edit ? "bright-GY" : ""
                  }`}
                >
                  {`${g.amount == 0 ? "" : fractionize(g.amount)}`}
                </div>
              </Col>
              {/* unit */}
              <Col
                xs={"3"}
                className="d-flex justify-content-center align-items-center"
              >
                <div
                  style={{
                    width: "90%",
                    background: "",
                    border: edit ? "" : "#69A7AB 1.5px solid",
                  }}
                  className={`px-2 d-flex align-items-center justify-content-center rounded ${
                    edit ? "bright-nb" : ""
                  }`}
                >
                  oz
                </div>
              </Col>
            </Row>
          );
        })}
      {/* Search bar - only in edit mode */}
      {edit && <IngredientSearch handleAdd={handleAddIngredient} />}
    </Container>
  );
};

export default DetailsEditRow;
