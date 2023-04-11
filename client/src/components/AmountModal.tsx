import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { handleManageEdit } from "./detailsEditRow";

type AmountModalProps = {
  show: boolean;
  amount: number;
  index: number;
  fractionize: (argo0: number) => string;
  handleClose: () => void;
  handleManageEdit: ({ index, action, amount }: handleManageEdit) => void;
};
const AmountModal = ({
  show,
  amount,
  index,
  fractionize,
  handleClose,
  handleManageEdit,
}: AmountModalProps) => {
  let initDec = (amount - Math.floor(amount))
    .toFixed(3)
    .toString()
    .split(".")[1];
  if (initDec !== "125") {
    initDec = initDec.slice(0, 2);
  }

  const initIntDec = {
    int: Math.floor(amount),
    dec: initDec,
  };
  const [intDec, setIntDec] = useState<{ int: number; dec: string }>(
    initIntDec
  );

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
      let newVal = decLadder[index + 1];
      setIntDec({ ...intDec, dec: newVal });
    }
    if (dir === "down") {
      let index = decLadder.indexOf(intDec.dec);
      let newVal = decLadder[index - 1];
      setIntDec({ ...intDec, dec: newVal });
    }
  };
  const calcAndSubmit = () => {
    let dec = decConvTable.find((item) => item.display === intDec.dec)?.value;
    if (dec === undefined) {
      toast.error("Something went wrong");
      return;
    }
    let calc = intDec.int + dec;

    if (calc === 0) {
      toast.error("Amount can't be zero");
      return;
    }
    handleManageEdit({ index: index, action: "update", amount: calc });
    handleClose();
  };

  return (
    <>
      <Modal show={show} centered size="sm">
        <Modal.Header
          closeButton
          className="bg-black bright-active"
          style={{ borderBottom: "none" }}
        >
          <Modal.Title>Set Amount</Modal.Title>
        </Modal.Header>
        <Modal.Body className=" modal-active">
          <Row className="d-flex align-items-center justify-content-center">
            {/* Integer Portion */}
            <Col
              xs={"1"}
              className="d-flex flex-column align-items-end justify-content-center"
            >
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
                    fill-rule="evenodd"
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
                    fill-rule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </button>
            </Col>
            <Col
              xs={"1"}
              className="d-flex justify-content-center"
              style={{ width: "1px" }}
            >
              .
            </Col>
            {/* Decimal portion */}
            <Col
              xs={"2"}
              className="d-flex flex-column align-items-center justify-content-center "
            >
              <button
                className="d-flex justify-content-center align-items-center p-1 rounded button-un"
                onClick={() => ladder("up")}
                disabled={intDec.dec === "¾"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className={`bi bi-chevron-up ${
                    intDec.dec === "¾" || intDec.dec === "75"
                      ? "fill-dis"
                      : "bright-fill"
                  }`}
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
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
                disabled={intDec.dec === "00"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className={`bi bi-chevron-down ${
                    intDec.dec === "00" ? "fill-dis" : "bright-fill"
                  }`}
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </button>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer
          className="bg-black bright-active"
          style={{ borderTop: "none" }}
        >
          <Button variant="danger" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={calcAndSubmit}>
            Set
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AmountModal;
