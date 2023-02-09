import axios from "axios";
import React, { DOMElement, ReactElement, useEffect, useState } from "react";
import { foodByGroup } from "../utilities/interfaces";
import { Card } from "react-bootstrap";

const Store = () => {
  const [foodgroups, setFoodgroups] = useState<JSX.Element[]>([]);
  useEffect(() => {
    const getFoodByGroup = async () => {
      const foods = await axios.get("http://localhost:3000/db/food-by-group");
      if (foods.data) {
        const foodData: foodByGroup[] | undefined = foods.data;
        let rows: JSX.Element[] = [];
        foodData?.map((datum, i) => {
          rows.push(
            <Card
              style={{
                width: "auto",
                background: "black",
                border: "#6ba2d5 1.5px solid",
                gap: "10px",
                padding: "3px 8px",
              }}
              className="shadow-lg h-33 d-flex flex-row justify-content-between align-items-center"
            >
              {datum.foodgroup}
            </Card>
          );
        });
        setFoodgroups(rows);
      }
    };
    getFoodByGroup();
  }, []);

  return (
    <div>
      <h1 className="text-white mt-5">The Store Opens Monsterously</h1>
      <div
        style={{ gap: "4px", maxWidth: "40rem" }}
        className="d-flex flex-wrap justify-content-between"
      >
        {foodgroups}
      </div>
    </div>
  );
};

export default Store;
