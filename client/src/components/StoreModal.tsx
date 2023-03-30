import { Unit } from "convert-units";
import React, { useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useAuth } from "../context/AuthContext";
import { cart_item, item, item_generic } from "../utilities/interfaces";

type StoreModalProps = {
  show: boolean;
  selectedItem: cart_item | undefined;
  atHome: number;
  handleClose: () => void;
  handleManageBasket: (action: string) => void;
  handleAmount: (action: string) => void;
  amount: number;
  unit: Unit;
  setUnit: (arg0: Unit) => void;
};
type initial = { amount: number; unit: Unit };

const StoreModal = ({
  show,
  handleClose,
  selectedItem,
  handleManageBasket,
  atHome,
  handleAmount,
  unit,
  setUnit,
  amount,
}: StoreModalProps) => {
  const { units } = useAuth();
  if (selectedItem === undefined || units === undefined) return null;
  const initAmount = useMemo(() => amount, []);
  const initUnit = useMemo(() => unit, []);

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header
          closeButton
          className="bg-black bright-active"
          style={{ borderBottom: "none" }}
        >
          <Modal.Title>{selectedItem?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className=" modal-active d-flex flex-column">
          {" "}
          <div className="h4 d-flex flex-row">
            {" "}
            Adjust amount:{" "}
            <button
              disabled={amount > 0 ? false : true}
              className="button-un mx-2 amount-btn"
              onClick={() => handleAmount("less")}
              style={{ opacity: `${amount > 0 ? 1 : 0.2}` }}
            >
              &#10094;
            </button>{" "}
            <span className="amount">{amount}</span>{" "}
            <button
              className="button-un mx-2 amount-btn"
              onClick={() => handleAmount("more")}
            >
              &#10095;
            </button>{" "}
          </div>
          <span className="atHomeText">At home: {atHome}</span>
          <div className="d-flex flex-wrap gap-1 mt-2">
            {units &&
              units.map((u) => {
                let selected = u.short === unit;
                return (
                  <div
                    className={`bg-black ${
                      selected ? "bright-blue" : "bright"
                    } p-1 rounded d-flex align-items-center justify-content-center`}
                    style={{ width: "4rem" }}
                    key={u.id}
                    onClick={() => setUnit(u.short)}
                  >
                    {u.short}
                  </div>
                );
              })}
          </div>
        </Modal.Body>
        <Modal.Footer
          className="bg-black bright-active"
          style={{ borderTop: "none" }}
        >
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={amount === initAmount && unit === initUnit ? true : false}
            onClick={() => handleManageBasket("update")}
          >
            Adjust
          </Button>
          <Button variant="danger" onClick={() => handleManageBasket("remove")}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StoreModal;
