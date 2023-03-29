import React from "react";
import { Card } from "react-bootstrap";
import { item } from "../utilities/interfaces";
type itemProps = {
  item: item;
  handleShow: (arg0: item) => void;
};

const ShelfItem = ({ item, handleShow }: itemProps) => {
  return (
    <Card
      style={{
        width: "auto",
        background: "black",
        // border: "#6ba2d5 1.5px solid",
        gap: "10px",
        padding: "3px 8px",
      }}
      onClick={() => handleShow(item)}
      className="item-bright shadow-lg h-33 d-flex flex-row justify-content-between align-items-center"
    >
      <div>{item.name}</div>
      <div
        style={{ background: "#AB6969" }}
        className="d-flex text-center rounded px-1 gap-1"
      >
        <span>{item.quantity}</span>
        <span className="text-nowrap">{item.unit}</span>
      </div>
    </Card>
  );
};

export default ShelfItem;
