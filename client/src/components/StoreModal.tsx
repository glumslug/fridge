import { Unit } from "convert-units";
import React, { useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useAuth } from "../context/AuthContext";
import { cart_item, item, item_generic } from "../utilities/interfaces";
import { toast } from "react-toastify";
import { Col, Row } from "react-bootstrap";
import { handleManageBasketProps } from "../pages/Store";

type StoreModalProps = {
  show: boolean;
  selectedItem: cart_item | undefined;
  atHome: { amount: number; unit: Unit | null };
  handleClose: () => void;
  handleManageBasket: ({
    action,
    unit,
    amount,
  }: handleManageBasketProps) => void;
};
type initial = { amount: number; unit: Unit };

const StoreModal = ({
  show,
  handleClose,
  selectedItem,
  handleManageBasket,
  atHome,
}: StoreModalProps) => {
  const { units } = useAuth();
  if (selectedItem === undefined || units === undefined) return null;
  const initAmount = selectedItem.quantity;
  const initUnit = selectedItem.unit;
  let initDec = (initAmount - Math.floor(initAmount))
    .toFixed(3)
    .toString()
    .split(".")[1];
  if (initDec !== "125") {
    initDec = initDec.slice(0, 2);
  }

  const initIntDec = {
    int: Math.floor(initAmount),
    dec: initDec,
  };
  const [intDec, setIntDec] = useState<{ int: number; dec: string }>(
    initIntDec
  );
  const [newUnit, setNewUnit] = useState<Unit>(selectedItem.unit);

  const decConvTable = [
    { display: "00", unicode: "0", value: 0 },
    { display: "125", unicode: "⅛", value: 0.125 },
    { display: "25", unicode: "¼", value: 0.25 },
    { display: "33", unicode: "⅓", value: 0.33 },
    { display: "50", unicode: "½", value: 0.5 },
    { display: "66", unicode: "⅔", value: 0.66 },
    { display: "75", unicode: "¾", value: 0.75 },
  ];

  const decLadder = ["00", "125", "25", "33", "50", "66", "75"];
  // const decLadder = ["0", "⅛", "¼", "⅓", "½", "⅔", "¾"];
  const ladder = (dir: string) => {
    if (dir === "up") {
      let index = decLadder.indexOf(intDec.dec);
      let newVal = decLadder[(index + 1) % decLadder.length];
      setIntDec({ ...intDec, dec: newVal });
    }
    if (dir === "down") {
      let index = decLadder.indexOf(intDec.dec);
      let newVal = decLadder.at(index - 1);
      if (newVal === undefined) return;
      setIntDec({ ...intDec, dec: newVal });
    }
  };
  const handleCalc = () => {
    let dec = decConvTable.find((item) => item.display === intDec.dec)?.value;
    if (dec === undefined) {
      toast.error("Something went wrong");
      return;
    }
    let calc = intDec.int + dec;
    return calc;
  };
  const handleUpdate = () => {
    let calc = handleCalc();
    if (calc === 0 || calc === undefined) {
      toast.error("Amount must be above zero!");
      return;
    } else {
      handleManageBasket({ action: "update", amount: calc, unit: newUnit });
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
          <Modal.Title className="d-flex justify-content-between align-items-center w-100">
            {selectedItem?.name}{" "}
            <span className="atHomeText" style={{ fontSize: "1rem" }}>
              At Home: {atHome.amount + " " + (atHome.unit ? atHome.unit : "")}
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className=" modal-active d-flex flex-column">
          <div className="d-flex align-items-center justify-content-around">
            <div className="d-flex align-items-center gap-2">
              {/* Integer Portion */}
              <div className="d-flex flex-column align-items-center justify-content-center">
                <div
                  className="d-flex justify-content-center align-items-center p-1 rounded"
                  onClick={() => setIntDec({ ...intDec, int: intDec.int + 1 })}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-chevron-up bright-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
                    />
                  </svg>
                </div>

                <div
                  style={{ minWidth: "1.7rem" }}
                  className="d-flex justify-content-center align-items-center p-1 bg-black rounded"
                >
                  {intDec.int}
                </div>
                <button
                  className="d-flex justify-content-center align-items-center p-1 rounded button-un"
                  onClick={() => setIntDec({ ...intDec, int: intDec.int - 1 })}
                  disabled={intDec.int === 0}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className={`bi bi-chevron-down ${
                      intDec.int === 0 ? "fill-dis" : "bright-fill"
                    }`}
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </button>
              </div>
              <div
                className="d-flex justify-content-center"
                style={{ width: "1px" }}
              >
                .
              </div>
              {/* Decimal portion */}
              <div className="d-flex flex-column align-items-center justify-content-center ">
                <button
                  className="d-flex justify-content-center align-items-center p-1 rounded button-un"
                  onClick={() => ladder("up")}
                  // disabled={intDec.dec === "75"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-chevron-up bright-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
                    />
                  </svg>
                </button>

                <div className="d-flex justify-content-center align-items-center p-1 bg-black rounded">
                  {intDec.dec}
                </div>
                <button
                  className="d-flex justify-content-center align-items-center p-1 rounded button-un"
                  onClick={() => ladder("down")}
                  // disabled={intDec.dec === "00"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-chevron-down bright-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div
              className="d-flex flex-wrap gap-1 mt-2 align-items-center"
              // style={{ width: "33%" }}
            >
              {units &&
                units.map((u) => {
                  let selected = u.short === newUnit;
                  return (
                    <div
                      className={`bg-black ${
                        selected ? "bright-blue" : "bright"
                      } p-1 rounded d-flex align-items-center justify-content-center`}
                      style={{ width: "4rem" }}
                      key={u.id}
                      onClick={() => setNewUnit(u.short)}
                    >
                      {u.short}
                    </div>
                  );
                })}
            </div>
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
            disabled={handleCalc() === initAmount && newUnit === initUnit}
            onClick={handleUpdate}
          >
            Adjust
          </Button>
          <Button
            variant="danger"
            onClick={() =>
              handleManageBasket({
                action: "remove",
                amount: initAmount,
                unit: initUnit,
              })
            }
          >
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StoreModal;
