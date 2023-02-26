import axios from "axios";
import React, { ReactNode, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import FridgeModal from "../components/FridgeModal";
import Shelf from "../components/Shelf";
import { useAuth } from "../context/AuthContext";
import { userData, item } from "../utilities/interfaces";
import { Navigate, useNavigate } from "react-router-dom";

type items = {
  freezer: item[];
  fridge: item[];
  pantry: item[];
  closet: item[];
};

const Home = () => {
  const navigate = useNavigate();
  const { userData, manageItems } = useAuth();
  if (!userData) {
    navigate("/");
  }

  // const [userData, setUserData] = useState<userData[]>([]);
  const [freezer, setFreezer] = useState<item[]>([]);
  const [fridge, setFridge] = useState<item[]>([]);
  const [pantry, setPantry] = useState<item[]>([]);
  const [closet, setCloset] = useState<item[]>([]);
  const [items, setItems] = useState<items>();
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
  const handleShow = (food: string) => {
    let item = userData?.items.find((item) => item.name == food);
    if (item) {
      setAtHome(item?.quantity);
      setSelectedItem(item);
      setShow(true);
    }
  };
  const handelManage = async () => {
    if (!selectedItem) {
      alert("Please select an item first!");
      return;
    }
    handleClose();
    const result = await manageItems({
      product: selectedItem.product,
      atHome: atHome,
      amount: -Math.abs(amount),
    });
    if (result?.message) {
      alert(result.message);
    }
  };

  useEffect(() => {
    let obj: items = { freezer: [], fridge: [], pantry: [], closet: [] };
    userData?.items
      ? userData.items.map((item, i) => {
          switch (item.bin) {
            case "Freezer":
              obj.freezer.push(item);
              break;
            case "Fridge":
              obj.fridge.push(item);
              break;
            case "Pantry":
              obj.pantry.push(item);
              break;
            case "Closet":
              obj.closet.push(item);
              break;
            default:
              break;
          }
        })
      : null;
    setItems(obj);
  }, [userData]);

  return (
    <div>
      <FridgeModal
        show={show}
        handleClose={handleClose}
        selectedItem={selectedItem?.name || "nothing"}
        handleManage={handelManage}
        atHome={atHome}
        handleAmount={handleAmount}
        amount={amount}
      />

      <h1 className="text-white mt-5">Home</h1>

      <Container className="d-flex flex-column align-items-sm-center align-items-md-start">
        <Shelf bin="Freezer" items={items?.freezer} handleShow={handleShow} />
        <Shelf bin="Fridge" items={items?.fridge} handleShow={handleShow} />
        <Shelf bin="Pantry" items={items?.pantry} handleShow={handleShow} />
        <Shelf bin="Closet" items={items?.closet} handleShow={handleShow} />
      </Container>
    </div>
  );
};

export default Home;
