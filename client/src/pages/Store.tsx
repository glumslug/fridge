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
  Col,
} from "react-bootstrap";
import StoreModal from "../components/StoreModal";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ProductSearch from "../components/ProductSearch";
import conversionMachine from "../utilities/conversionMachine";

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
  // const binCart = {
  //   freezer: shoppingList?.filter((item) => item.bin == "freezer") || [],
  //   fridge: shoppingList?.filter((item) => item.bin == "fridge") || [],
  //   pantry: shoppingList?.filter((item) => item.bin == "pantry") || [],
  //   closet: shoppingList?.filter((item) => item.bin == "closet") || [],
  // };
  const binCart: cart_item[][] = [
    shoppingList?.filter((item) => item.bin == "freezer") || [],
    shoppingList?.filter((item) => item.bin == "fridge") || [],
    shoppingList?.filter((item) => item.bin == "pantry") || [],
    shoppingList?.filter((item) => item.bin == "closet") || [],
  ];
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
        unit: selectedItem.unit,
      });
    }
    manageCart({
      product: selectedItem.product,
      amount: amount,
      action: action,
      unit: selectedItem.unit,
    });

    handleClose();
  };

  const handleCheck = (item: cart_item, checked: boolean) => {
    let action = checked ? "add" : "remove";
    manageBasket({
      product: item.product,
      amount: item.quantity,
      action: action,
      unit: item.unit,
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

    manageCart({
      product: result.product,
      amount: 1,
      action: "add",
      unit: "fl-oz",
    });
  };

  const handlePurchase = async () => {
    let total = 0;
    const localBasket = localStorage.getItem("basket");
    const basket = localBasket ? JSON.parse(localBasket) : [];

    const response = await Promise.all(
      basket.items.map(async (item: basketItem) => {
        total += 1;
        let homeItem = userData?.items.find(
          (hi) => hi.product === item.product
        );
        let newUnit;
        let newAmount;
        console.log(homeItem);
        if (homeItem === undefined) {
          newAmount = item.amount;
          newUnit = item.unit;
        } else {
          newAmount = conversionMachine({
            amount: item.amount,
            source: item.unit,
            target: homeItem.unit,
          });
          newUnit = homeItem.unit;
        }

        let res = await upsertItem({
          product: item.product,
          amount: newAmount,
          unit: newUnit,
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
        <div
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
        >
          {shoppingList
            ? bins.map((bin, i) => {
                return (
                  <div key={bin} className="px-1 w-100">
                    {/* Bin title */}
                    {binCart !== undefined && binCart[i].length > 0 && (
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
                    <Row className="g-0 row w-100 justify-content-start justify-content-xs-center">
                      {binCart[i].map((item: cart_item, i: number) => {
                        return (
                          <Col
                            xs={"6"}
                            md={"4"}
                            className="py-1 d-flex align-items-center"
                            style={{
                              gap: "3px",
                              marginBottom: "5px",
                            }}
                            key={`${bin}${i}`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked.includes(item.product)}
                              onChange={(e) =>
                                handleCheck(item, e.target.checked)
                              }
                              style={{ marginRight: "5px", marginLeft: "10px" }}
                            />
                            <Card
                              style={{
                                background: "black",
                                gap: "5px",
                                padding: "3px 2px 3px 8px",
                              }}
                              className="w-100 item-bright shadow-lg h-33 d-flex flex-row justify-content-between align-items-center flex-nowrap "
                              onClick={() => handleShow(item)}
                            >
                              <div className="text-truncate">{item.name}</div>
                              <div
                                style={{
                                  background: "#AB6969",
                                }}
                                className="d-flex text-center rounded px-1 gap-1"
                              >
                                <span>{item.quantity}</span>
                                <span className="text-nowrap">{item.unit}</span>
                              </div>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                );
              })
            : null}
        </div>
        <div
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
        </div>
      </div>
    </div>
  );
};

export default Store;
