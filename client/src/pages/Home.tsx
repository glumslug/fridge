import axios from "axios";
import React, { ReactNode, useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import FridgeModal from "../components/FridgeModal";
import Shelf from "../components/Shelf";
import { useAuth } from "../context/AuthContext";
import { userData, item, productSearchItem } from "../utilities/interfaces";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProductSearch from "../components/ProductSearch";
import AddItemModal from "../components/AddItemModal";
type addModalProps = {
  show: boolean;
  item: productSearchItem | undefined;
};

const emptyAddModal = {
  show: false,
  item: undefined,
};
const Home = () => {
  const { userData, downsertItem, refreshContext } = useAuth();
  const binData = {
    freezer:
      userData?.items.length === 0
        ? []
        : userData?.items.filter((item) => item.bin == "freezer"),
    fridge:
      userData?.items.length === 0
        ? []
        : userData?.items.filter((item) => item.bin == "fridge"),
    pantry:
      userData?.items.length === 0
        ? []
        : userData?.items.filter((item) => item.bin == "pantry"),
    closet:
      userData?.items.length === 0
        ? []
        : userData?.items.filter((item) => item.bin == "closet"),
  };
  const [selectedItem, setSelectedItem] = useState<item>();
  const [show, setShow] = useState(false);
  const [addModal, setAddModal] = useState<addModalProps>(emptyAddModal);
  //Modal functions
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = (item: item) => {
    setSelectedItem(item);
    setShow(true);
  };

  const handleAdd = (item: productSearchItem) => {
    setAddModal({ show: true, item: item });
  };

  return (
    <>
      {show && (
        <FridgeModal
          show={show}
          handleClose={handleClose}
          selectedItem={selectedItem}
        />
      )}
      {addModal.show && (
        <AddItemModal
          show={addModal.show}
          handleClose={() => setAddModal(emptyAddModal)}
          selectedItem={addModal.item}
        />
      )}
      <div
        className=" d-flex align-items-center gap-4 mt-5 mx-1"
        style={{ maxWidth: "40rem" }}
      >
        <h1 className="text-white">Home</h1>
        <ProductSearch handleAdd={handleAdd} />
      </div>

      <div className="mx-1 d-flex flex-column align-items-sm-center align-items-md-start">
        {" "}
        <Shelf bin="Freezer" items={binData.freezer} handleShow={handleShow} />
        <Shelf bin="Fridge" items={binData.fridge} handleShow={handleShow} />
        <Shelf bin="Pantry" items={binData.pantry} handleShow={handleShow} />
        <Shelf bin="Closet" items={binData.closet} handleShow={handleShow} />
      </div>
    </>
  );
};

export default Home;
