import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { handleManageEdit } from "./detailsEditRow";

type UnitModalProps = {
  show: boolean;
  unit: number;
  displayUnit: string | undefined;
  index: number;
  handleClose: () => void;
  handleManageEdit: ({ index, action, unit }: handleManageEdit) => void;
};

type newUnitProps = { id: number; display: string };
const UnitModal = ({
  show,
  unit,
  displayUnit,
  index,
  handleClose,
  handleManageEdit,
}: UnitModalProps) => {
  const { units } = useAuth();

  const [newUnit, setNewUnit] = useState<newUnitProps>({
    id: units?.find((u) => u.id === unit)?.id || 0,
    display: displayUnit === undefined ? "-" : displayUnit,
  });

  const handleSubmit = () => {
    handleManageEdit({
      index: index,
      action: "update",
      unit: newUnit.id,
    });

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
          <Modal.Title>Set Unit</Modal.Title>
        </Modal.Header>
        <Modal.Body className=" modal-active">
          <div className="d-flex flex-wrap gap-1">
            {units?.map((u) => {
              let selected = u.id === newUnit.id;
              return (
                <div
                  className={`bg-black ${
                    selected ? "bright-blue" : "bright"
                  } p-1 rounded d-flex align-items-center justify-content-center`}
                  style={{ width: "4rem" }}
                  key={u.id}
                  onClick={() =>
                    setNewUnit({ id: u.id, display: u.short || u.singular })
                  }
                >
                  {u.short || u.singular}
                </div>
              );
            })}
          </div>
        </Modal.Body>
        <Modal.Footer
          className="bg-black bright-active"
          style={{ borderTop: "none" }}
        >
          <Button variant="danger" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            Set
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UnitModal;
