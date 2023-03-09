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
  const navigate = useNavigate();
  const { userData, manageItems } = useAuth();
  if (!userData) {
    navigate("/");
  }
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
        <Shelf
          bin="Freezer"
          items={userData?.items.freezer}
          handleShow={handleShow}
        />
        <Shelf
          bin="Fridge"
          items={userData?.items.fridge}
          handleShow={handleShow}
        />
        <Shelf
          bin="Pantry"
          items={userData?.items.pantry}
          handleShow={handleShow}
        />
        <Shelf
          bin="Closet"
          items={userData?.items.closet}
          handleShow={handleShow}
        />
      </Container>
    </div>
  );
};

export default Home;
