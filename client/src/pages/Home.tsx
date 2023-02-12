import axios from "axios";
import React, { ReactNode, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Shelf from "../components/Shelf";
import { useFridge } from "../context/FridgeContext";
import { userData } from "../utilities/interfaces";

const Home = () => {
  const { getUserData } = useFridge();
  const userData = getUserData();
  // const [userData, setUserData] = useState<userData[]>([]);
  const [shelves, setShelves] = useState<ReactNode[] | undefined>([]);
  useEffect(() => {}, []);

  useEffect(() => {
    console.log(userData);
    let rows: ReactNode[] = [];
    userData?.map((shelf, i) => {
      rows.push(<Shelf shelf={shelf} key={i} />);
    });
    setShelves(rows);
  }, [userData]);

  return (
    <div>
      <h1 className="text-white mt-5">The Fridge Opens Ominously</h1>

      <Container className="d-flex flex-column align-items-sm-center align-items-md-start">
        {shelves}
      </Container>
    </div>
  );
};

export default Home;
