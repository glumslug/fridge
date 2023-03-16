import axios from "axios";
import React, { ReactNode, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import FridgeModal from "../components/FridgeModal";
import Shelf from "../components/Shelf";
import { useAuth } from "../context/AuthContext";
import { userData, item } from "../utilities/interfaces";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const { userData, manageItems } = useAuth();
  const binData = {
    freezer: userData?.items.filter((item) => item.bin == "freezer"),
    fridge: userData?.items.filter((item) => item.bin == "fridge"),
    pantry: userData?.items.filter((item) => item.bin == "pantry"),
    closet: userData?.items.filter((item) => item.bin == "closet"),
  };
  const [amount, setAmount] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<item>();
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
  const handleShow = (item: item) => {
    setAtHome(item.quantity);
    setSelectedItem(item);
    setShow(true);
  };
  const handelManage = async () => {
    if (!selectedItem) {
      toast.error("Please select an item first!");
      return;
    }
    handleClose();

    const result = await manageItems({
      product: selectedItem.product,
      atHome: atHome,
      amount: -Math.abs(amount),
    });
    if (result?.message) {
      toast.success(result.message);
    }
  };

  return (
    <div>
      <FridgeModal
        show={show}
        handleClose={handleClose}
        selectedItem={selectedItem}
        handleManage={handelManage}
        atHome={atHome}
        handleAmount={handleAmount}
        amount={amount}
      />

      <h1 className="text-white mt-5">Home</h1>

      <Container className="mx-2 p-2 d-flex flex-column align-items-sm-center align-items-md-start">
        <Shelf bin="Freezer" items={binData.freezer} handleShow={handleShow} />
        <Shelf bin="Fridge" items={binData.fridge} handleShow={handleShow} />
        <Shelf bin="Pantry" items={binData.pantry} handleShow={handleShow} />
        <Shelf bin="Closet" items={binData.closet} handleShow={handleShow} />
      </Container>
    </div>
  );
};

export default Home;
