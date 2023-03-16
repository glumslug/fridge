import axios from "axios";
import React, { DOMElement, ReactElement, useEffect, useState } from "react";
import {
  basketItem,
  cart_item,
  item_generic,
  productSearchItem,
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
import ProductSearch from "../components/ProductSearch";

const Store = () => {
  const {
    upsertItem,
    userData,
    manageCart,
    basketData,
    manageBasket,
    refreshContext,
  } = useAuth();

  const [isChecked, setIsChecked] = useState<number[]>([]);
  const shoppingList = userData?.cart;
  const binCart = {
    freezer: shoppingList?.filter((item) => item.bin == "freezer"),
    fridge: shoppingList?.filter((item) => item.bin == "fridge"),
    pantry: shoppingList?.filter((item) => item.bin == "pantry"),
    closet: shoppingList?.filter((item) => item.bin == "closet"),
  };
  const bins = ["freezer", "fridge", "pantry", "closet"];
  const homeList = userData?.items;
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
      homeList?.find(
        (home_item: item_generic) => home_item.product == cart_item.product
      )?.quantity || 0
    );
    setAmount(cart_item.quantity);
    setShow(true);
  };

  // Cart functions
  const handleManageBasket = async (action: string) => {
    if (!selectedItem) {
      toast.error("Please select an item first!");
      return;
    }
    if (isChecked.includes(selectedItem.product)) {
      const result = await manageBasket({
        product: selectedItem.product,
        amount: amount,
        action: action,
      });
    }
    manageCart({
      product: selectedItem.product,
      amount: amount,
      action: action,
    });

    handleClose();
  };

  const handleCheck = (item: cart_item, checked: boolean) => {
    let action = checked ? "add" : "remove";
    manageBasket({
      product: item.product,
      amount: item.quantity,
      action: action,
    });
  };

  const handleAdd = (result: productSearchItem) => {
    // Check if already in cart
    const exists = shoppingList?.some(
      (item: cart_item) => result.product == item.product
    );
    if (exists) {
      toast.error(
        "Item already in cart! Adjust quantity by tapping cart-item."
      );
      return;
    }

    manageCart({ product: result.product, amount: 1, action: "add" });
  };

  const handlePurchase = async () => {
    let total = 0;
    const basket = JSON.parse(localStorage.getItem("basket"));
    console.log(basket);
    const response = await Promise.all(
      basket.items.map(async (item: basketItem) => {
        total += 1;
        let res = await upsertItem({
          product: item.product,
          amount: item.amount,
        });
        return res?.message;
      })
    );
    refreshContext("purchase");
    toast.success(`Successfully added ${total} items.`);
  };

  // Preserve checks on refresh
  useEffect(() => {
    let arr: number[] = [];
    basketData?.items.map((item) => {
      arr.push(item.product);
    });
    setIsChecked(arr);
  }, [basketData]);

  return (
    <div>
      <StoreModal
        show={show}
        handleClose={handleClose}
        selectedItem={selectedItem}
        handleManageBasket={handleManageBasket}
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
          {shoppingList
            ? bins.map((bin, i) => {
                return (
                  <div key={bin} className="w-100">
                    {/* Bin title */}
                    {binCart[bin].length > 0 && (
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
                      {binCart[bin].map((item: cart_item, i: number) => {
                        return (
                          <div
                            className="col-md-4 col-6 d-flex align-items-center"
                            style={{ gap: "10px", marginBottom: "5px" }}
                            key={`${bin}${i}`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked.includes(item.product)}
                              onChange={(e) =>
                                handleCheck(item, e.target.checked)
                              }
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
              })
            : null}
        </Row>
        <Row
          style={{
            maxWidth: "40rem",
            width: "40rem",
            gap: "5px",
          }}
          className="mx-1 d-flex justify-content-between flex-nowrap"
        >
          {/* Product search */}
          <ProductSearch handleAdd={handleAdd} />
          <Button
            variant="outline-dark"
            style={{
              width: "auto",
              border: "2px solid #705151",
              color: "white",
              flexShrink: "1",
            }}
            onClick={() =>
              isChecked.length > 0
                ? handlePurchase()
                : toast.error("No items checked off!")
            }
          >
            Checkout
          </Button>
        </Row>
      </div>
    </div>
  );
};

export default Store;
