import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { cart_item, item, item_generic } from "../utilities/interfaces";

type StoreModalProps = {
  show: boolean;
  selectedItem: cart_item | undefined;
  atHome: number;
  handleClose: () => void;
  handleManageBasket: (action: string) => void;
  handleAmount: (action: string) => void;
  amount: number;
};
const StoreModal = ({
  show,
  handleClose,
  selectedItem,
  handleManageBasket,
  atHome,
  handleAmount,
  amount,
}: StoreModalProps) => {
  const [initial, setInitial] = useState<number>(amount);
  useEffect(() => {
    console.log(amount, initial);
  }, [amount]);

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header
          closeButton
          className="bg-black bright-active"
          style={{ borderBottom: "none" }}
        >
          <Modal.Title>{selectedItem?.name + ", " + initial}</Modal.Title>
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
            disabled={amount === initial ? true : false}
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
