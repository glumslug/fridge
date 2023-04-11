import { Unit } from "convert-units";
import React, { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

type BodyUl = { name: string; amount: number; unit: Unit };
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
          {message.body.ul && (
            <Table striped bordered variant="dark">
              <thead className="spanYN">
                <tr>
                  <th className="ps-2">Ingredient</th>
                  <th className="text-center">Amount</th>
                  <th className="text-center">Unit</th>
                </tr>
              </thead>
              <tbody>
                {message.body.ul?.map((m) => {
                  return (
                    <tr key={m.name}>
                      <td>{m.name}</td>
                      <td className="spanYN text-center">{m.amount}</td>
                      <td className="spanYN text-center">{m.unit}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
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
