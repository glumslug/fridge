import axios from "axios";
import React, { DOMElement, ReactElement, useEffect, useState } from "react";
import {
  basketItem,
  cart_item,
  foodByGroup,
  item_generic,
  searchItem,
  shoppingList,
} from "../utilities/interfaces";
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
import { toast } from "react-toastify";

const Store = () => {
  const {
    searchProducts,
    upsertItem,
    userData,
    addToCart,
    basketData,
    manageBasket,
    refreshContext,
  } = useAuth();
  const [searchResults, setSearchResults] = useState<searchItem[]>([]);
  const [isChecked, setIsChecked] = useState<number[]>([]);
  const shoppingList = userData?.cart;
  const homeList = userData?.items;
  const [key, setKey] = useState("");
  const [amount, setAmount] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<cart_item>();
  const [show, setShow] = useState(false);
  const [atHome, setAtHome] = useState<number>(0);
  //Modal functions
  const handleClose = () => {
    setAmount(1);
    setShow(false);
  };
  const handleAmount = (action: string) => {
    if (action === "less") {
      if (amount != 0) {
        setAmount(amount - 1);
      }
    } else {
      setAmount(amount + 1);
    }
  };
  const handleShow = (cart_item: cart_item) => {
    setSelectedItem(cart_item);
    setAtHome(
      homeList[cart_item.bin].find(
        (home_item: item_generic) => (home_item.product = cart_item.product)
      ).quantity || 0
    );

    setShow(true);
  };
  const handleManage = async () => {
    if (!selectedItem) {
      toast.error("Please select an item first!");
      return;
    }
    handleClose();

    const result = await manageBasket({
      product: selectedItem.product_id,
      amount: -Math.abs(amount),
      action: selectedItem.quantity - amount > 0 ? "update" : "remove",
    });
  };

  const handleCheck = (item: cart_item, checked: boolean) => {
    let action = checked ? "add" : "remove";
    manageBasket({
      product: item.product,
      amount: item.quantity,
      action: action,
    });
  };
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
      const results: searchItem[] = await searchProducts(str);
      setSearchResults(results);
    }
  };

  useEffect(() => {
    let arr: number[] = [];
    basketData?.items.map((item) => {
      arr.push(item.product);
    });
    setIsChecked(arr);
  }, [basketData]);

  const handleAdd = (result: searchItem) => {
    let amount: number = 1;
    addToCart({ product: result.id, amount: amount });
  };
  const handlePurchase = async () => {
    let total = 0;
    const basket = JSON.parse(localStorage.getItem("basket"));
    console.log(basket);
    Promise.all(
      basket.items.map((item: basketItem) => {
        total += 1;
        upsertItem({ product: item.product, amount: item.amount });
      })
    )
    .then(() => toast.success(`Purchased ${total} items!`));
  };

  return (
    <div>
      <StoreModal
        show={show}
        handleClose={handleClose}
        selectedItem={selectedItem}
        handleManage={handleManage}
        atHome={atHome}
        handleAmount={handleAmount}
        amount={amount}
      />
      <h1 className="text-white mt-5">Shopping List</h1>
      <div
        style={{ gap: "4px", maxWidth: "40rem" }}
        className="d-flex flex-wrap justify-content-between"
      >
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
          {Object.keys(shoppingList).map((bin, i) => {
            return (
              <div key={bin} className="w-100">
                {/* Bin title */}
                {shoppingList[bin].length > 0 && (
                  <div
                    style={{
                      borderBottom: "2px solid #A1D3FF",
                      marginBottom: "5px",
                    }}
                  >
                    {bin.charAt(0).toUpperCase() + bin.slice(1)}
                  </div>
                )}
                {/* Bin items */}
                <div className="row w-100">
                  {shoppingList[bin].map((item: cart_item, i: number) => {
                    return (
                      <div
                        className="col-md-4 col-6 d-flex align-items-center"
                        style={{ gap: "10px", marginBottom: "5px" }}
                        key={`${bin}${i}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked.includes(item.product)}
                          onChange={(e) => handleCheck(item, e.target.checked)}
                        />
                        <Card
                          style={{
                            width: "8rem",
                            background: "black",
                            gap: "10px",
                            padding: "3px 8px",
                          }}
                          className="item-bright shadow-lg h-33 d-flex flex-row justify-content-between align-items-center flex-nowrap "
                          onClick={() => handleShow(item)}
                        >
                          <div className="text-truncate">{item.name}</div>
                          <div
                            style={{
                              minWidth: "1.5rem",
                              background: "#AB6969",
                            }}
                            className="text-center rounded"
                          >
                            {item.quantity}
                          </div>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </Row>
        <Row
          style={{
            width: "40rem",
          }}
          className="mx-1 d-flex justify-content-end"
        >
          <Button
            variant="outline-dark"
            className="my-1"
            style={{
              width: "auto",
              border: "2px solid #705151",
              color: "white",
            }}
            onClick={handlePurchase}
          >
            Checkout
          </Button>
        </Row>
        {/* Product search */}
        <InputGroup className="mb-3">
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            className="bg-transparent border-1 border-black rounded text-white"
            placeholder="Search to add items..."
            onKeyDown={(e) => setKey(e.key)}
            onChange={(e) => handleSearch(e)}
          />
        </InputGroup>
        <Container
          className="d-flex flex-column"
          style={{
            gap: "10px",
          }}
        >
          {searchResults.map((result) => {
            return (
              <div
                className="d-flex align-items-center"
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
                    width: "40rem",
                    background: "black",
                    // border: "#6ba2d5 1.5px solid",
                    gap: "10px",
                    padding: "3px 8px",
                  }}
                  onClick={() => handleAdd(result)}
                  className="item-bright shadow-lg h-33 d-flex flex-row justify-content-between align-items-center"
                >
                  {result.name}
                </Card>
              </div>
            );
          })}
        </Container>
      </div>
    </div>
  );
};

export default Store;
