import React from "react";
import { Row } from "react-bootstrap";
import ShelfItem from "./ShelfItem";
const filter = "/sliders2.svg";
import { item } from "../utilities/interfaces";
type shelfProps = {
  bin: string;
  items: item[] | undefined;
  handleShow: (arg0: item) => void;
};
const colors = {
  Freezer: "#1D44D1",
  Fridge: "#2F6EF7",
  Pantry: "#214DEB",
  Closet: "#2351F7",
};
const Shelf = ({ bin, items, handleShow }: shelfProps) => {
  return (
    <div
      style={{
        minHeight: "3rem",
        border: "1.5px #AAAAAA solid",
        // borderColor: "#3960E8",
        maxWidth: "40rem",
        background: "#141414",
        gap: "12px",
      }}
      className="shadow-lg my-3 position-relative p-2 pt-5 w-100 rounded g-0 masonry-with-columns"
    >
      {/* Name and filter */}
      <div
        style={{
          transform: "translate(-.4rem, -0.4rem)",
          border: "1.5px #AAAAAA solid",
          background: "#1b1a1a",
          padding: "2px 6px",
          width: "auto",
          gap: "7px",
        }}
        className="position-absolute top-0 end-0 d-flex flex-row justify-content-between align-items-center"
      >
        {/* Name plaque */}
        <div>{bin}</div>
      </div>
      {items?.map((item, i) => {
        return <ShelfItem item={item} key={i} handleShow={handleShow} />;
      })}
    </div>
  );
};

export default Shelf;
