import React from "react";
import { Card } from "react-bootstrap";
import { item } from "../utilities/interfaces";
type itemProps = {
  item: item;
};

const ShelfItem = ({ item }: itemProps) => {
  return (
    <Card
      style={{
        width: "auto",
        background: "black",
        // border: "#6ba2d5 1.5px solid",
        gap: "10px",
        padding: "3px 8px",
      }}
      onClick={() => console.log("hi")}
      className="item-bright shadow-lg h-33 d-flex flex-row justify-content-between align-items-center"
    >
      <div>{item.name}</div>
      <div
        style={{ width: "1.5rem", background: "#AB6969" }}
        className="text-center rounded"
      >
        {item.quantity}
      </div>
    </Card>
  );
};

export default ShelfItem;
