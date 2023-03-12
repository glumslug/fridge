import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";
import { Card, Container, InputGroup, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { recipeSearchItem } from "../utilities/interfaces";

type searchProps = {
  handleOpen: (results: recipeSearchItem) => void;
};

const RecipeSearch = ({ handleOpen }: searchProps) => {
  const [searchResults, setSearchResults] = useState<recipeSearchItem[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [key, setKey] = useState("");

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const str = e.target.value;
    setSearchValue(str);
    const len = str.split("").length;
    if (
      !str ||
      (len === 0 && key === "Backspace") ||
      (len === 0 && key === "Delete")
    ) {
      setSearchResults([]);
    } else {
      try {
        const response = await axios.post("db/recipes", { search: str });

        setSearchResults(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Access to config, request, and response
          console.log(error.response); // this is the main part. Use the response property from the error object
          toast.error(error.response?.data);
          return error.response as AxiosResponse;
        } else {
          // Just a stock error
          return error as Error;
        }
      }
    }
  };

  const handleSelect = (result: recipeSearchItem) => {
    // Reset search bar
    setSearchResults([]);
    setSearchValue("");

    //Open Recipe
    handleOpen(result);
  };
  return (
    <>
      <InputGroup className="p-0 ">
        <Form.Control
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          className="border-1 border-black rounded text-white shadow-none"
          placeholder="Search recipes..."
          onKeyDown={(e) => setKey(e.key)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e)}
          style={{
            border: "1.5px solid #529CDF",
            background: "#202020",
            padding: "2px 10px",
          }}
          value={searchValue}
        />
      </InputGroup>

      {searchResults.map((result, i) => {
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
            className="item-bright shadow-lg h-33 d-flex flex-row justify-content-between align-items-center"
          >
            {result.name}
            <div className="d-flex" style={{ gap: "5px" }}>
              {result.author ? (
                <div
                  style={{ width: "auto", background: "#AB6969" }}
                  className="text-center rounded px-1"
                >
                  {result.author}
                </div>
              ) : null}
              <div
                style={{ width: "auto", background: "#69A7AB" }}
                className="text-center rounded px-1"
              >
                {result.cuisine}
              </div>
            </div>
          </Card>
        );
      })}
    </>
  );
};

export default RecipeSearch;
