import axios from "axios";
import React, { DOMElement, ReactElement, useEffect, useState } from "react";
import { foodByGroup } from "../utilities/interfaces";
import { Card, Row } from "react-bootstrap";
import PopUp from "../components/PopUp";

const Store = () => {
  const user = 1;
  const stockBox: HTMLElement | null = document.getElementById("stockBox");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (food: string) => {
    setSelectedItem(food);
    setShow(true);
  };
  const handlePurchase = async () => {
    handleClose();
    const add = await axios.post("http://localhost:3000/db/add-item", {
      name: selectedItem,
      owner: user,
      quantity: 1,
    });
    if (add.data) {
      if (add.data.warningStatus == 0) {
        alert("Successfully Added!");
      } else {
        alert("Something went wrong!");
      }
    }
  };
  const resetBox = () => {
    stockBox != null ? (stockBox.scrollTop = 0) : null;
  };
  const [foodgroups, setFoodgroups] = useState<JSX.Element[]>([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [fullStock, setFullStock] = useState<foodByGroup[]>([]);
  const [stock, setStock] = useState<JSX.Element[]>([]);
  useEffect(() => {
    const getFoodByGroup = async () => {
      const foods = await axios.get("http://localhost:3000/db/food-by-group");
      if (foods.data) {
        const foodData: foodByGroup[] = foods.data;
        setFullStock(foodData);
      }
    };
    getFoodByGroup();
  }, []);

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
      <PopUp
        show={show}
        handleClose={handleClose}
        selectedItem={selectedItem}
        handlePurchase={handlePurchase}
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
