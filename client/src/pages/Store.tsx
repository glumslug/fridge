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
  Button,
} from "react-bootstrap";
import StoreModal from "../components/StoreModal";
import { useAuth } from "../context/AuthContext";

const Store = () => {
  const { searchProducts, upsertItem, userData } = useAuth();
  const [searchResults, setSearchResults] = useState([]);
  const [shoppingList, setShoppingList] = useState<item[]>([]);
  const [key, setKey] = useState("");
  const handleSearch = async (e) => {
    const str = e.target.value;
    const len = str.split("").length;
    if (
      !str ||
      (len === 0 && key === "Backspace") ||
      (len === 0 && key === "Delete")
    ) {
      setSearchResults([]);
    } else {
      const results = await searchProducts(str);
      setSearchResults(results);
    }
  };
  const handlePurchase = () => {
    // let atHome =
    //   userData?.items.find((item) => item.product === product)?.quantity || 0;
    // console.log(atHome);
    shoppingList.map((item) => {
      let amount = 1;
      upsertItem({ product: item.id, amount: amount });
    });
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
        >
          {shoppingList.map((item) => {
            return (
              <Card
                style={{
                  width: "auto",
                  background: "black",
                  // border: "#6ba2d5 1.5px solid",
                  gap: "10px",
                  padding: "3px 8px",
                }}
                className="item-bright shadow-lg h-33 d-flex flex-row justify-content-between align-items-center"
              >
                {item.name}
              </Card>
            );
          })}
        </Row>
        <Button onClick={handlePurchase}>Checkout</Button>
        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            Default
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            onKeyDown={(e) => setKey(e.key)}
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
                  onClick={() => setShoppingList([...shoppingList, result])}
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
