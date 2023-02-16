import axios from "axios";
import React, { ReactNode, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import FridgeModal from "../components/FridgeModal";
import Shelf from "../components/Shelf";
import { useFridge } from "../context/FridgeContext";
import { userData } from "../utilities/interfaces";

const Home = () => {
  const user = { name: "Richard", id: 1 }; // Once i create a user context and a sign in this will be dynamically set
  const { getUserData, manageItems } = useFridge();
  const userData = getUserData();
  // const [userData, setUserData] = useState<userData[]>([]);
  const [shelves, setShelves] = useState<ReactNode[] | undefined>([]);
  const [amount, setAmount] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState("");
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
    const userShelf = userData.find((shelf) => shelf.user == user.name);
    let item = userShelf?.items.find((item) => item.name == food);
    if (item) setAtHome(item?.quantity);
    setSelectedItem(food);
    setShow(true);
  };
  const handelManage = async () => {
    handleClose();
    const result = await manageItems({
      name: selectedItem,
      user: user.id,
      atHome: atHome,
      amount: -Math.abs(amount),
    });
    if (result?.message) {
      alert(result.message);
    }
  };

  useEffect(() => {
    console.log(userData);
    let rows: ReactNode[] = [];
    userData?.map((shelf, i) => {
      rows.push(<Shelf shelf={shelf} key={i} handleShow={handleShow} />);
    });
    setShelves(rows);
  }, [userData]);

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
      <h1 className="text-white mt-5">The Fridge Opens Ominously</h1>

      <Container className="d-flex flex-column align-items-sm-center align-items-md-start">
        {shelves}
      </Container>
    </div>
  );
};

export default Home;
