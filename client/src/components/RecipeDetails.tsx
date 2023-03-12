import React from "react";

const RecipeDetails = ({ recipe }) => {
  return (
    <>
      <div
        style={{
          borderBottom: "2px solid #A1D3FF",
          marginBottom: "5px",
        }}
      >
        {recipe.name}
      </div>
    </>
  );
};

export default RecipeDetails;
