import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { ingredient } from "../utilities/interfaces";
import { ingredientList } from "./RecipeDetails";
import { ingredientListDisp } from "../pages/LandingPage";

type DisplayRowProps = {
  ingredients: ingredientList[] | null | undefined | ingredientListDisp[];
  fractionize: (argo0: number) => string;
};
const DetailsDisplayRow = ({ ingredients, fractionize }: DisplayRowProps) => {
  return (
    <Container className="me-2">
      {/* Header Row */}
      {ingredients?.length !== 0 ? (
        <Row className="g-0 mb-2" style={{ fontSize: "13px" }}>
          <Col
            xs={"5"}
            className="px-2 d-flex align-items-center justify-content-start"
          >
            Ingredient
          </Col>
          <Col
            xs={"5"}
            className="d-flex align-items-center justify-content-center"
          >
            Amount
          </Col>

          <Col
            xs={"2"}
            className="d-flex align-items-center justify-content-center"
          >
            Status
          </Col>
        </Row>
      ) : (
        <div
          className="w-100 d-flex justify-content-center"
          style={{ fontStyle: "italic" }}
        >
          Click "Edit" to add ingredients.
        </div>
      )}

      {/* Ingredients */}
      {ingredients?.map((g: ingredientList | ingredientListDisp) => {
        return (
          <Row className="g-0 d-flex mb-1" key={g.ingredient_id}>
            {/* Title */}

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
              xs={"5"}
              className="d-flex align-items-center justify-content-center"
            >
              <div
                style={{
                  width: "70%",
                  background: "",
                  border: "#69A7AB 1.5px solid",
                }}
                className="px-2 d-flex align-items-center justify-content-center rounded"
              >
                {`${fractionize(g.amount)} ${
                  g.unit_short ||
                  (g.amount > 1 ? g.unit_plural : g.unit_singular)
                }`}
              </div>
            </Col>
            {/* Status / unit (in edit mode) */}
            <Col
              xs={"2"}
              className="d-flex justify-content-center align-items-center"
            >
              <div
                style={{
                  minWidth: "1rem",
                  minHeight: "1rem",
                  borderRadius: "3px",
                  border: "1px solid black",
                }}
                className={`${g.stockStatus}`}
              ></div>
            </Col>
          </Row>
        );
      })}
    </Container>
  );
};

export default DetailsDisplayRow;
