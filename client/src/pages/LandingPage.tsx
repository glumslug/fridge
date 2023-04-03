import React, { useState } from "react";
import FridgeHome from "/FridgeHome.png";
import FridgeRecipeDetails from "/FridgeRecipeDetails.png";
import FridgeShoppingList from "/FridgeShoppingList.png";
import { Container, Image } from "react-bootstrap";

const LandingPage = () => {
  const [reel, setReel] = useState(1);
  setTimeout(() => {
    if (reel < 3) setReel(reel + 1);
    else setReel(1);
  }, 5000);
  return (
    <div>
      <h1 style={{ borderBottom: "1.5px #8bbff0 solid", maxWidth: "40rem" }}>
        Welcome to The Fridge
      </h1>

      <Container className="slideText">
        <h4>Create Recipes</h4>
        <h4>Turn them into shopping lists</h4>
        <h4>Keep track of what you have</h4>
      </Container>
      <div className="slide-down">
        <div className="slide-card">
          <Container className="d-flex align-items-center">
            {" "}
            <Image src={FridgeRecipeDetails}></Image>
          </Container>

          <Container className="d-flex align-items-center">
            {" "}
            <Image src={FridgeShoppingList}></Image>
          </Container>

          <Container className="d-flex align-items-center">
            {" "}
            <Image src={FridgeHome}></Image>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
