import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { cart_item, item, item_generic } from "../utilities/interfaces";

type StoreModalProps = {
  show: boolean;
  selectedItem: cart_item | undefined;
  atHome: number;
  handleClose: () => void;
  handleManage: () => void;
  handleAmount: (type: string) => void;
  amount: number;
};
const StoreModal = ({
  show,
  handleClose,
  selectedItem,
  handleManage,
  atHome,
  handleAmount,
  amount,
}: StoreModalProps) => {
  // console.log(selectedItem);
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
            In cart:{" "}
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
            {selectedItem?.name}?{" "}
          </div>
          <span className="atHomeText">At home: {atHome}</span>
        </Modal.Body>
        <Modal.Footer
          className="bg-black bright-active"
          style={{ borderTop: "none" }}
        >
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary">Adjust</Button>
          <Button variant="danger">Remove</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StoreModal;
