import React from "react";
import { Card } from "react-bootstrap";
import { item } from "../utilities/interfaces";
import convert from "convert-units";
type itemProps = {
  item: item;
  handleShow: (arg0: item) => void;
};

const ShelfItem = ({ item, handleShow }: itemProps) => {
  let bestQuant = convert(item.quantity)
    .from(item.unit)
    .toBest({
      exclude: [
        "mm3",
        "cm3",
        "ml",
        "l",
        "kl",
        "m3",
        "km3",
        "in3",
        "pnt",
        "qt",
        "gal",
        "ft3",
        "yd3",
      ],
    });
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
        <span>{bestQuant.val}</span>
        <span className="text-nowrap">{bestQuant.unit}</span>
      </div>
    </Card>
  );
};

export default ShelfItem;
