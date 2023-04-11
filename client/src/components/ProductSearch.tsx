import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";
import { Card, Container, InputGroup, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { productSearchItem } from "../utilities/interfaces";
import ProductMakerModal from "./ProductMakerModal";

type searchProps = {
  handleAdd: (results: productSearchItem) => void;
};

const ProductSearch = ({ handleAdd }: searchProps) => {
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
    handleSelect(product);
    setProductModal(false);
  };
  return (
    <>
      {productModal && (
        <ProductMakerModal
          show={productModal}
          handleAddProduct={handleAddProduct}
          handleClose={() => setProductModal(false)}
        />
      )}
      <InputGroup
        className="p-0"
        style={{ maxHeight: "2.5rem", minHeight: "2.2rem", flexShrink: "1" }}
      >
        <Form.Control
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          className="py-0 bg-transparent border-1 border-black rounded text-white"
          placeholder="Search to add items..."
          onKeyDown={(e) => setKey(e.key)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e)}
          style={{ border: "2px solid #5b5b5b" }}
          value={searchValue}
        />
        {searchResults.length > 0 && (
          <Container
            className="rounded d-flex flex-column position-absolute pb-1 "
            style={{
              gap: "10px",
              transform: "translateY(3rem)",
              width: "101%",
              zIndex: "100",
              background: "#1b1a1a",

              borderRadius: "0 0 5px 5px",
            }}
          >
            {searchResults.map((result, i) => {
              return (
                <div
                  className="d-flex align-items-center"
                  style={{
                    gap: "10px",
                  }}
                  key={i}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="15"
                    fill="currentColor"
                    className="bi bi-plus-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                  </svg>
                  <Card
                    style={{
                      width: "40rem",
                      background: "black",
                      gap: "10px",
                    }}
                    onClick={() => handleSelect(result)}
                    className="item-bright shadow-lg h-33 d-flex flex-row justify-content-between align-items-center ps-2"
                  >
                    {result.name}
                  </Card>
                </div>
              );
            })}
            {searchValue && (
              <div
                className="d-flex align-items-center justify-content-end"
                style={{
                  gap: "10px",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-plus-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
                <Card
                  style={{
                    width: "auto",
                    background: "black",
                    gap: "10px",
                    padding: "3px 8px",
                  }}
                  onClick={() => setProductModal(true)}
                  className="item-bright shadow-lg h-33 d-flex flex-row justify-content-between align-items-center"
                >
                  Add New
                </Card>
              </div>
            )}
          </Container>
        )}
      </InputGroup>
    </>
  );
};

export default ProductSearch;
