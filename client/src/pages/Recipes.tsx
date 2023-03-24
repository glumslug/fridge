import { useState } from "react";
import { Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import CreateRecipe from "../components/CreateRecipe";
import RecipeDetails from "../components/RecipeDetails";
import RecipeResult from "../components/RecipeResult";
import RecipeSearch from "../components/RecipeSearch";
import { useAuth } from "../context/AuthContext";
import { recipe } from "../utilities/interfaces";

function Recipes() {
  // Recipe search and select page, options to filter, search, add new
  // Selecting a recipe or adding new will lead to the same recipe details component
  // Search should be exported to a utility component
  const [selectedRecipe, setSelectedRecipe] = useState<recipe | null>(null);
  // 3 states: overview, details, create
  const [view, setView] = useState<string>("overview");
  const { userData } = useAuth();
  const myRecipes = userData?.myRecipes;
  const savedRecipes = userData?.savedRecipes;

  // handler for creating new recipe
  const handleNew = () => {
    setView("create");
  };

  // handler for selecting recipe, switcheds to recipe details view
  const handleSelect = (result: recipe) => {
    setSelectedRecipe(result);
    setView("details");
  };
  return (
    <>
      <h1 className="text-white mt-5">{`${
        view == "create" ? "Create " : ""
      }Recipe${view == "overview" ? "s" : ""}`}</h1>
      <div
        style={{ gap: "4px", maxWidth: "40rem" }}
        className="d-flex flex-wrap justify-content-between"
      >
        {view == "overview" ? (
          <Row
            id="stockBox"
            style={{
              minHeight: "7rem",
              // maxHeight: "20rem",
              overflowY: "scroll",
              border: "2px solid #3960E8",
              maxWidth: "40rem",
              background: "#141414",
              gap: "12px",
            }}
            className="shadow-lg mt-3 mx-1 position-relative p-2 w-100 rounded d-flex flex-column align-items-start "
            sm={5}
          >
            <RecipeSearch handleOpen={handleSelect} />
            {/* My recipes section */}
            {myRecipes !== undefined && myRecipes?.length > 0 ? (
              <div
                style={{
                  borderBottom: "2px solid #3960E8",

                  marginTop: "1rem",
                  width: "100%",
                  color: "#3960E8",
                }}
              >
                My Recipes
              </div>
            ) : null}
            {myRecipes?.map((rec) => {
              return (
                <RecipeResult
                  handleSelect={handleSelect}
                  result={rec}
                  key={rec.id}
                />
              );
            })}

            {/* Saved recipes section */}
            {savedRecipes !== undefined && savedRecipes?.length > 0 ? (
              <div
                style={{
                  borderBottom: "2px solid #3960E8",

                  marginTop: "1rem",
                  width: "100%",
                  color: "#3960E8",
                }}
              >
                Saved Recipes
              </div>
            ) : null}
            {savedRecipes?.map((sav) => {
              return (
                <RecipeResult
                  handleSelect={handleSelect}
                  result={sav}
                  key={sav.id}
                />
              );
            })}

            {/* Add new button */}
            <div className="my-2 w-100 p-0 d-flex flex-row justify-content-end align-items-center">
              {/* <div className="mx-1">&#43;</div> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#6ba2d5"
                className="bi bi-plus-circle mx-2"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              <Button
                style={{
                  width: "auto",

                  gap: "10px",
                  padding: "3px 8px",
                  // border: "1px solid #529CDF",
                  background: "#202020",
                }}
                onClick={() => handleNew()}
                className="item-bright shadow-lg h-33 "
              >
                Add New
              </Button>
            </div>
          </Row>
        ) : null}
        {view == "details" && selectedRecipe ? (
          <RecipeDetails
            recipe={selectedRecipe}
            setView={setView}
            myOwn={selectedRecipe.author_id == userData?.id}
          />
        ) : null}
        {view == "create" ? (
          <CreateRecipe
            setView={setView}
            setSelectedRecipe={setSelectedRecipe}
          />
        ) : null}
      </div>
    </>
  );
}

export default Recipes;
