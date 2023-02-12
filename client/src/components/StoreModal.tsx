import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

type StoreModalProps = {
  show: boolean;
  selectedItem: string;
  atHome: number;
  handleClose: () => void;
  handlePurchase: () => void;
  handleAmount: (type: string) => void;
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
};
const StoreModal = ({
  show,
  handleClose,
  selectedItem,
  handlePurchase,
  atHome,
  handleAmount,
  amount,
  setAmount,
}: StoreModalProps) => {
  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header
          closeButton
          className="bg-black bright-active"
          style={{ borderBottom: "none" }}
        >
          <Modal.Title>Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body className=" modal-active d-flex flex-column">
          {" "}
          <div className="d-flex flex-row">
            {" "}
            Purchase{" "}
            <button
              className="button-un mx-2"
              onClick={() => handleAmount("less")}
            >
              &#10094;
            </button>{" "}
            <span className="amount">{amount}</span>{" "}
            <button
              className="button-un mx-2"
              onClick={() => handleAmount("more")}
            >
              &#10095;
            </button>{" "}
            {selectedItem}?{" "}
          </div>
          <span className="atHomeText">In Fridge: {atHome}</span>
        </Modal.Body>
        <Modal.Footer
          className="bg-black bright-active"
          style={{ borderTop: "none" }}
        >
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
          <Button variant="primary" onClick={handlePurchase}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StoreModal;
