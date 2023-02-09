import axios from "axios";
import React, { ReactNode, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Shelf from "../components/Shelf";
import { userData } from "../utilities/interfaces";

const Home = () => {
  const [shelves, setShelves] = useState<ReactNode[] | undefined>([]);

  useEffect(() => {
    const getUserData = async () => {
      const users = await axios.get("http://localhost:3000/db/userItems");
      if (users.data) {
        const userData: userData[] | undefined = users.data;
        let rows: ReactNode[] = [];
        userData?.map((shelf, i) => {
          rows.push(<Shelf shelf={shelf} key={i} />);
        });
        setShelves(rows);
      }
    };
    getUserData();
  }, []);

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
