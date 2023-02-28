import axios from "axios";
import React, { DOMElement, ReactElement, useEffect, useState } from "react";
import { foodByGroup, item } from "../utilities/interfaces";
import {
  Card,
  InputGroup,
  Row,
  Form,
  CardGroup,
  Container,
} from "react-bootstrap";
import StoreModal from "../components/StoreModal";
import { useAuth } from "../context/AuthContext";

const Store = () => {
  const { searchProducts, purchaseItems, userData } = useAuth();
  const [searchResults, setSearchResults] = useState([]);
  const handleSearch = async (e) => {
    const results = await searchProducts(e.target.value);
    console.log(results);
    setSearchResults(results);
  };
  const handlePurchase = (product) => {
    let atHome =
      userData?.items.find((item) => item.product === product)?.quantity || 0;
    console.log(atHome);
    let amount = 1;
    purchaseItems({ product, atHome, amount });
  };
  return (
    <div>
      <h1 className="text-white mt-5">Shopping List</h1>
      <div
        style={{ gap: "4px", maxWidth: "40rem" }}
        className="d-flex flex-wrap justify-content-between"
      >
        <Row
          id="stockBox"
          style={{
            minHeight: "7rem",
            maxHeight: "20rem",
            overflowY: "scroll",
            border: "1.5px #AAAAAA solid",
            maxWidth: "40rem",
            background: "#141414",
            gap: "12px",
          }}
          className="shadow-lg my-3 mx-1 position-relative p-2 w-100 rounded align-items-end"
          sm={5}
        ></Row>
        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            Default
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            onChange={(e) => handleSearch(e)}
          />
        </InputGroup>
        <Container className="d-flex flex-column">
          {searchResults.map((result) => {
            return (
              <CardGroup className="d-flex">
                <Card
                  style={{
                    width: "auto",
                    background: "black",
                    // border: "#6ba2d5 1.5px solid",
                    gap: "10px",
                    padding: "3px 8px",
                  }}
                  onClick={() => handlePurchase(result.id)}
                  className="item-bright shadow-lg h-33 d-flex flex-row justify-content-between align-items-center"
                >
                  {result.name}
                </Card>
              </CardGroup>
            );
          })}
        </Container>
      </div>
    </div>
  );
};

export default Store;
