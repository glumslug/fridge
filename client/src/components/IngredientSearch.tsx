import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";
import { Card, Container, InputGroup, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { productSearchItem } from "../utilities/interfaces";
import ProductMakerModal from "./ProductMakerModal";

type searchProps = {
  handleAdd: (results: productSearchItem) => void;
};

const IngredientSearch = ({ handleAdd }: searchProps) => {
  const [searchResults, setSearchResults] = useState<productSearchItem[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [key, setKey] = useState("");
  const [productModal, setProductModal] = useState(false);

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
        const response = await axios.post("db/products", { search: str });

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

  const handleSelect = (result: productSearchItem) => {
    // Reset search bar
    setSearchResults([]);
    setSearchValue("");

    //Add product to shopping cart
    handleAdd(result);
  };

  const handleAddProduct = (product: productSearchItem) => {
    setProductModal(false);
    handleSelect(product);
  };
  return (
    <>
      {productModal && (
        <ProductMakerModal
          show={productModal}
          handleClose={() => setProductModal(false)}
          handleAddProduct={handleAddProduct}
        />
      )}
      <InputGroup className="p-0 mt-2">
        <Form.Control
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          className="py-0 bg-transparent border-1 border-black rounded text-white"
          placeholder="Search to add items..."
          onKeyDown={(e) => setKey(e.key)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e)}
          style={{ border: "1px solid #5b5b5b" }}
          value={searchValue}
        />
        <div className="d-flex flex-column mt-1 w-100 gap-1 ms-1">
          {searchResults.map((result) => {
            return (
              <div
                className="d-flex align-items-center w-100 gap-1 "
                key={result.product}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-plus-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
                <div
                  key={result.product}
                  onClick={() => handleSelect(result)}
                  className="bright-blue plus-circle shadow-lg d-flex flex-row justify-content-between align-items-center rounded px-2 w-100"
                >
                  {result.name}
                </div>
              </div>
            );
          })}
          {searchResults.length > 0 && (
            <div className="d-flex align-items-center w-100 gap-1 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-plus-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              <div
                onClick={() => setProductModal(true)}
                className="bright-blue plus-circle shadow-lg d-flex flex-row justify-content-between align-items-center rounded px-2"
              >
                Add New
              </div>
            </div>
          )}
        </div>
      </InputGroup>
    </>
  );
};

export default IngredientSearch;
