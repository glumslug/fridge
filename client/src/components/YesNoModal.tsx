import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

type BodyUl = { name: string; amount: number };
type YesNoModalProps = {
  show: boolean;
  message: {
    title: string;
    body: { pre?: string; span?: string; post?: string; ul?: BodyUl[] };
  };
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
        <Modal.Body className=" modal-active">
          {message.body.pre}
          <span className="spanYN">{message.body.span}</span>
          {message.body.post}
          <ul>
            {message.body.ul?.map((m) => {
              return (
                <li key={m.name}>
                  <span className="spanYN">{m.amount}x</span> {m.name}
                </li>
              );
            })}
          </ul>
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
