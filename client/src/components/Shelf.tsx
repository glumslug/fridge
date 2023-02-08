import React from "react";
import { Row } from "react-bootstrap";
import ShelfItem from "./ShelfItem";
const filter = "public/sliders2.svg";
// import { userData } from "../utilities/interfaces";
type userData = {
  user: string;
  items: [
    {
      name: string;
      quantity: number;
    }
  ];
};
const Shelf = ({ shelf }: userData) => {
  console.log(shelf);
  return (
    <Row
      style={{
        height: "7rem",
        border: "1.5px #AAAAAA solid",
        maxWidth: "40rem",
        background: "#141414",
        gap: "12px",
      }}
      className="shadow-lg my-3 position-relative p-2 w-100 rounded align-items-end"
      sm={5}
    >
      {/* Name and filter */}
      <div
        style={{
          transform: "translate(-.4rem, -.6rem)",
          border: "1.5px #AAAAAA solid",
          background: "#1b1a1a",
          padding: "2px 6px",
          width: "auto",
          gap: "7px",
        }}
        className="position-absolute top-0 end-0 d-flex flex-row justify-content-between align-items-center"
      >
        {/* Name plaque */}
        <div>{shelf.user}</div>
        {/* Filter options */}
        <div className="d-flex button-like">
          <img
            style={{
              width: "1.2rem",
              filter:
                "invert(51%) sepia(6%) saturate(2992%) hue-rotate(314deg) brightness(91%) contrast(83%)",
            }}
            src={filter}
            alt=""
          />
        </div>
      </div>
      {shelf.items.map((item) => {
        return <ShelfItem item={item} />;
      })}
    </Row>
  );
};

export default Shelf;
