import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

type FridgeModalProps = {
  show: boolean;
  selectedItem: string;
  atHome: number;
  handleClose: () => void;
  handleManage: () => void;
  handleAmount: (type: string) => void;
  amount: number;
};
const FridgeModal = ({
  show,
  handleClose,
  selectedItem,
  handleManage,
  atHome,
  handleAmount,
  amount,
}: FridgeModalProps) => {
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
            Use/toss{" "}
            <button
              disabled={amount > 0 ? false : true}
              className="button-un mx-2"
              onClick={() => handleAmount("less")}
              style={{ opacity: `${amount > 0 ? 1 : 0.2}` }}
            >
              &#10094;
            </button>
            <span className="amount">{amount}</span>{" "}
            <button
              disabled={amount < atHome ? false : true}
              className="button-un mx-2"
              onClick={() => handleAmount("more")}
              style={{ opacity: `${amount < atHome ? 1 : 0.2}` }}
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
          <Button
            variant="primary"
            onClick={handleManage}
            disabled={amount == 0 ? true : false}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FridgeModal;
