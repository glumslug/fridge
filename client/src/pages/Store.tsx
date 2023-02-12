import axios from "axios";
import React, { DOMElement, ReactElement, useEffect, useState } from "react";
import { foodByGroup } from "../utilities/interfaces";
import { Card, Row } from "react-bootstrap";
import StoreModal from "../components/StoreModal";
import { useFridge } from "../context/FridgeContext";

const Store = () => {
  const user = "Richard"; // Once i create a user context and a sign in this will be dynamically set
  const { getStoreData, getUserData, purchaseItems } = useFridge();
  const [show, setShow] = useState(false);
  const [atHome, setAtHome] = useState<number>(0);
  const fullStock = getStoreData();
  const fridgeItems = getUserData();
  const [foodgroups, setFoodgroups] = useState<JSX.Element[]>([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [stock, setStock] = useState<JSX.Element[]>([]);
  const [amount, setAmount] = useState<number>(1);
  const stockBox: HTMLElement | null = document.getElementById("stockBox");

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
  const handleShow = (food: string) => {
    const userShelf = fridgeItems.find((shelf) => shelf.user == user);
    let item = userShelf?.items.find((item) => item.name == food);
    if (item) setAtHome(item?.quantity);
    setSelectedItem(food);
    setShow(true);
  };
  const handlePurchase = async () => {
    handleClose();
    const result = await purchaseItems({
      name: selectedItem,
      user: user,
      atHome: atHome,
      amount: amount,
    });
    if (result?.message) {
      alert(result.message);
    }
  };
  const resetBox = () => {
    stockBox != null ? (stockBox.scrollTop = 0) : null;
  };

  useEffect(() => {
    let rows: JSX.Element[] = [];
    fullStock?.map((datum, i) => {
      rows.push(
        <Card
          key={i}
          style={{
            width: "auto",
            background: "black",
            gap: "10px",
            padding: "3px 8px",
          }}
          className={`bright shadow-lg h-33 d-flex flex-row justify-content-between align-items-center ${
            datum.foodgroup === selectedGroup ? "bright-active" : null
          }`}
          onClick={() => getStock(datum.foodgroup)}
        >
          {datum.foodgroup}
        </Card>
      );
    });
    setFoodgroups(rows);
  }, [fullStock, selectedGroup]);

  const getStock = (foodgroup: string) => {
    let rows: JSX.Element[] = [];
    resetBox();
    setSelectedGroup(foodgroup);
    fullStock?.map((group) => {
      if (group.foodgroup == foodgroup) {
        group.foods.map((food, i) => {
          rows.push(
            <Card
              key={i}
              style={{
                width: "auto",
                background: "black",
                // border: "#6ba2d5 1.5px solid",
                gap: "10px",
                padding: "3px 8px",
              }}
              className="shadow-lg h-33 d-flex flex-row justify-content-between align-items-center item-bright"
              onClick={() => handleShow(food)}
            >
              {food}
            </Card>
          );
        });
        setStock(rows);
      }
    });
  };

  return (
    <div>
      <StoreModal
        show={show}
        handleClose={handleClose}
        selectedItem={selectedItem}
        handlePurchase={handlePurchase}
        atHome={atHome}
        handleAmount={handleAmount}
        amount={amount}
        setAmount={setAmount}
      />

      <h1 className="text-white mt-5">The Store Opens Monsterously</h1>
      <div
        style={{ gap: "4px", maxWidth: "40rem" }}
        className="d-flex flex-wrap justify-content-between"
      >
        {foodgroups}
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
          {stock}
        </Row>
      </div>
    </div>
  );
};

export default Store;
