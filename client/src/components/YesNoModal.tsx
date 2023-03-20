import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

type YesNoModalProps = {
  show: boolean;
  message: { title: string; body: string | JSX.Element };
  handleClose: () => void;
  handleAction: () => void;
};
const YesNoModal = ({
  show,
  message,
  handleClose,
  handleAction,
}: YesNoModalProps) => {
  return (
    <>
      <Modal show={show} centered>
        <Modal.Header
          closeButton
          className="bg-black bright-active"
          style={{ borderBottom: "none" }}
        >
          <Modal.Title>{message.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className=" modal-active d-flex flex-column">
          {message.body}
        </Modal.Body>
        <Modal.Footer
          className="bg-black bright-active"
          style={{ borderTop: "none" }}
        >
          <Button variant="danger" onClick={handleClose}>
            No
          </Button>
          <Button variant="success" onClick={handleAction}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default YesNoModal;
