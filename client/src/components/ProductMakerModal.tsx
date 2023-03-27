import { useState } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { productSearchItem } from "../utilities/interfaces";
import { handleManageEdit } from "./detailsEditRow";

type ProductMakerModalProps = {
  show: boolean;
  handleClose: () => void;
  handleAddProduct: (argo0: productSearchItem) => void;
};
type productProps = {
  name: string;
  bin: string;
};
const ProductMakerModal = ({
  show,
  handleClose,
  handleAddProduct,
}: ProductMakerModalProps) => {
  const { createProduct } = useAuth();
  const [product, setProduct] = useState<productProps>({ name: "", bin: "" });
  const handleSubmit = async () => {
    if (!product.name) {
      toast.error("Please type a name!");
      return;
    }
    if (!product.bin) {
      toast.error("Please select a bin!");
      return;
    }
    const newProduct = await createProduct(product);
    if (newProduct?.data) {
      handleAddProduct(newProduct.data);
    }
  };

  return (
    <>
      <Modal show={show} centered>
        <Modal.Header
          closeButton
          className="bg-black bright-active"
          style={{ borderBottom: "none" }}
        >
          <Modal.Title>Create Product</Modal.Title>
        </Modal.Header>
        <Modal.Body className=" modal-active">
          <InputGroup className="p-0 d-flex flex-column w-100">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              className="border-1 border-black rounded text-white shadow-none w-100"
              placeholder="Product Name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setProduct({ ...product, name: e.target.value })
              }
              style={{
                border: "1.5px solid #529CDF",
                background: "#202020",
                padding: "2px 10px",
              }}
              value={product.name}
            />
            <div className="d-flex w-100 gap-1 mt-2 justify-content-start">
              <div
                className={`item ${
                  product.bin === "freezer" ? "bright-blue" : "bright"
                } p-1 rounded d-flex align-items-center justify-content-center`}
                style={{ width: "20%" }}
                onClick={() => setProduct({ ...product, bin: "freezer" })}
              >
                Freezer
              </div>

              <div
                className={`item ${
                  product.bin === "fridge" ? "bright-blue" : "bright"
                } p-1 rounded d-flex align-items-center justify-content-center`}
                style={{ width: "20%" }}
                onClick={() => setProduct({ ...product, bin: "fridge" })}
              >
                Fridge
              </div>

              <div
                className={`item ${
                  product.bin === "pantry" ? "bright-blue" : "bright"
                } p-1 rounded d-flex align-items-center justify-content-center px-2`}
                style={{ width: "20%" }}
                onClick={() => setProduct({ ...product, bin: "pantry" })}
              >
                Pantry
              </div>
              <div
                className={`item ${
                  product.bin === "closet" ? "bright-blue" : "bright"
                } p-1 rounded d-flex align-items-center justify-content-center`}
                style={{ width: "20%" }}
                onClick={() => setProduct({ ...product, bin: "closet" })}
              >
                Closet
              </div>
            </div>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer
          className="bg-black bright-active"
          style={{ borderTop: "none" }}
        >
          <Button variant="danger" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductMakerModal;
