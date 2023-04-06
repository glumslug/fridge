import { Unit } from "convert-units";
import React, { useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useAuth } from "../context/AuthContext";
import { productSearchItem } from "../utilities/interfaces";
import { toast } from "react-toastify";
import conversionMachine from "../utilities/conversionMachine";

type AddItemModalProps = {
  show: boolean;
  selectedItem: productSearchItem | undefined;
  handleClose: () => void;
};

const AddItemModal = ({
  show,
  handleClose,
  selectedItem,
}: AddItemModalProps) => {
  const { units, upsertItem, refreshContext, userData } = useAuth();
  if (
    selectedItem === undefined ||
    units === undefined ||
    userData === undefined ||
    userData === null
  )
    return null;
  const [amount, setAmount] = useState<number>(1);
  const [unit, setUnit] = useState<Unit>("fl-oz");

  const handleAmount = (action: string) => {
    if (action === "less") {
      if (amount != 0) {
        setAmount(amount - 1);
      }
    } else {
      setAmount(amount + 1);
    }
  };

  const handleAdd = async () => {
    let homeItem = userData.items.find(
      (hi) => hi.product === selectedItem.product
    );
    let newUnit;
    let newAmount;
    if (homeItem === undefined) {
      newAmount = amount;
      newUnit = unit;
    } else {
      newAmount = conversionMachine({
        amount: amount,
        source: unit,
        target: homeItem.unit,
      });
      newUnit = homeItem.unit;
    }
    let res = await upsertItem({
      product: selectedItem.product,
      amount: newAmount,
      unit: newUnit,
    });
    if (res?.message) {
      refreshContext();
      toast.success("Item added!");
      handleClose();
    }
  };
  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header
          closeButton
          className="bg-black bright-active"
          style={{ borderBottom: "none" }}
        >
          <Modal.Title>
            Add <span className="spanYN">{selectedItem?.name}</span> to{" "}
            {selectedItem.bin}?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className=" modal-active d-flex flex-column">
          {" "}
          <div className="h4 d-flex flex-row">
            {" "}
            Amount:{" "}
            <button
              disabled={amount <= 0}
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
          <Button variant="primary" onClick={handleAdd}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddItemModal;
