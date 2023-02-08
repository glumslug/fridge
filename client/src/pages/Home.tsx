import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Shelf from "../components/Shelf";
import Store from "../components/Store";
import { Items, userData } from "../utilities/interfaces";

const Home = () => {
  const [shelves, setShelves] = useState<userData[] | undefined>([]);

  useEffect(() => {
    const getUserData = async () => {
      const users = await axios.get("http://localhost:3000/db/userItems");
      if (users.data) {
        const userData: userData[] | undefined = users.data;
        let rows = [];
        userData?.map((shelf) => {
          rows.push(<Shelf shelf={shelf} />);
        });
        setShelves(rows);
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    console.log(shelves);
  }, [shelves]);

  return (
    <div>
      <h1 className="text-white mt-5">The Fridge Opens Ominously</h1>

      <Container className="d-flex flex-column align-items-sm-center align-items-md-start">
        {shelves}
      </Container>
      <Store />
    </div>
  );
};

export default Home;
