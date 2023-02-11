import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

type PopUpProps = {
  show: boolean;
  selectedItem: string;
  handleClose: () => void;
  handlePurchase: () => void;
};
const PopUp = ({
  show,
  handleClose,
  selectedItem,
  handlePurchase,
}: PopUpProps) => {
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
        <Modal.Body className=" modal-active">
          {" "}
          Purchase {selectedItem}?
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

export default PopUp;
