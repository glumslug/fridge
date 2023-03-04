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
    <Row
      style={{
        minHeight: "3rem",
        border: "1.5px #AAAAAA solid",
        // borderColor: "#3960E8",
        maxWidth: "40rem",
        background: "#141414",
        gap: "12px",
        paddingTop: "1rem",
      }}
      className="shadow-lg my-3 position-relative p-2 pt-5 w-100 rounded align-items-end"
      sm={5}
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
          // zIndex: "10",
        }}
        className="position-absolute top-0 end-0 d-flex flex-row justify-content-between align-items-center"
      >
        {/* Name plaque */}
        <div>{bin}</div>
        {/* Filter options */}
        {/* <div className="d-flex button-like">
          <img
            style={{
              width: "1.2rem",
              filter:
                "invert(51%) sepia(6%) saturate(2992%) hue-rotate(314deg) brightness(91%) contrast(83%)",
            }}
            src={filter}
            alt=""
            onClick={() => alert("This feature is not live yet!")}
          />
        </div> */}
      </div>
      {items?.map((item, i) => {
        return <ShelfItem item={item} key={i} handleShow={handleShow} />;
      })}
    </Row>
  );
};

export default Shelf;
