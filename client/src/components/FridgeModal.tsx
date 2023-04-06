import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { item } from "../utilities/interfaces";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Unit } from "convert-units";
import conversionMachine from "../utilities/conversionMachine";

type FridgeModalProps = {
  show: boolean;
  selectedItem: item | undefined;
  handleClose: () => void;
};
const FridgeModal = ({ show, handleClose, selectedItem }: FridgeModalProps) => {
  if (selectedItem === undefined) return null;
  const { units, refreshContext, downsertItem } = useAuth();
  const [newUnit, setNewUnit] = useState(selectedItem.unit);
  const atHome: { amount: number; unit: Unit } = {
    amount: selectedItem.quantity,
    unit: selectedItem.unit,
  };
  const [atHomeComp, setAtHomeComp] = useState(1);
  const [newAmount, setNewAmount] = useState(1);

  const handleAmount = (action: string) => {
    if (action === "less") {
      if (newAmount != 0) {
        setNewAmount(newAmount - 1);
        let conv = conversionMachine({
          amount: newAmount - 1,
          source: newUnit,
          target: atHome.unit,
        });
        setAtHomeComp(conv);
      }
    } else {
      setNewAmount(newAmount + 1);
      let conv = conversionMachine({
        amount: newAmount + 1,
        source: newUnit,
        target: atHome.unit,
      });
      setAtHomeComp(conv);
    }
  };
  const handleUnit = (unit: Unit) => {
    let conv = conversionMachine({
      amount: atHome.amount,
      source: atHome.unit,
      target: unit,
    });
    if (conv < 1) {
      toast.error("Not enough in " + selectedItem.bin + " for a " + unit);
      return;
    } else {
      setNewUnit(unit);
      setNewAmount(1);
      let conv = conversionMachine({
        amount: 1,
        source: unit,
        target: atHome.unit,
      });
      setAtHomeComp(conv);
    }
  };
  const handleManage = async () => {
    const result = await downsertItem({
      product: selectedItem.product,
      amount: atHomeComp,
    });
    if (result?.message) {
      refreshContext();
      toast.success(result.message);
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
          <Modal.Title>{selectedItem?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className=" modal-active d-flex flex-column">
          {" "}
          <div className="d-flex flex-row align-items-center h4 flex-wrap">
            {" "}
            Use/toss{" "}
            <button
              disabled={newAmount > 0 ? false : true}
              className="button-un mx-2 amount-btn"
              onClick={() => handleAmount("less")}
              style={{ opacity: `${newAmount > 0 ? 1 : 0.2}` }}
            >
              &#10094;
            </button>
            <span className="amount">{newAmount}</span>{" "}
            <button
              disabled={atHomeComp == atHome.amount}
              className="button-un mx-2 amount-btn"
              onClick={() => handleAmount("more")}
              style={{ opacity: `${atHomeComp == atHome.amount ? 0.2 : 1}` }}
            >
              &#10095;
            </button>
            <div className="d-flex gap-1">
              {units?.map((un) => {
                let selected = un.short === newUnit;
                return (
                  <div
                    key={un.short}
                    className={`bg-black ${
                      selected ? "bright-blue" : "bright"
                    } p-1 rounded d-flex align-items-center justify-content-center`}
                    style={{ fontSize: "15px" }}
                    onClick={() => handleUnit(un.short)}
                  >
                    {un.short}
                  </div>
                );
              })}
            </div>
            ?
          </div>
          <span className="atHomeText">
            In {selectedItem.bin}: {atHome.amount} {selectedItem.unit}
          </span>
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
            disabled={newAmount == 0}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FridgeModal;
