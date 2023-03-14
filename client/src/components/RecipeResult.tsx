import React from "react";
import { Card } from "react-bootstrap";
import { recipe } from "../utilities/interfaces";
type RecipeResultProps = {
  result: recipe;
  handleSelect: (result: recipe) => void;
};
const RecipeResult = ({ result, handleSelect }: RecipeResultProps) => {
  return (
    <Card
      style={{
        width: "100%",

        gap: "10px",
        padding: "3px 8px",
        // border: "1px solid #529CDF",
        background: "#202020",
      }}
      onClick={() => handleSelect(result)}
      className="text-nowrap item-bright shadow-lg h-33 d-flex flex-row justify-content-between align-items-center"
    >
      {result.title}
      <div className="d-flex " style={{ gap: "5px" }}>
        <div
          style={{ width: "auto", background: "#AB6969" }}
          className="d-flex align-items-center text-center rounded px-1"
        >
          {result.author_name ? result.author_name : result.author_alias}
        </div>

        <div
          style={{ width: "auto", background: "#69A7AB" }}
          className="d-flex align-items-center text-center rounded px-1"
        >
          {result.cuisine}
        </div>
      </div>
    </Card>
  );
};

export default RecipeResult;
