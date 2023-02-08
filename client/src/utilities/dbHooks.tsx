import axios, { AxiosResponse } from "axios";
import { Items, Users } from "./interfaces";

const getAllItems = async () => {
  const response: AxiosResponse = await axios.get(
    "http://localhost:3000/db/get-items"
  );
  if (response.data) {
    let d: Items[] = response.data;
    return d;
  }
};

const getUsers = async () => {
  const response: AxiosResponse = await axios.get(
    "http://localhost:3000/db/users"
  );
  if (response.data) {
    let d: Users[] = response.data;
    return d;
  }
};

const getItemsByUser = async (id: number) => {
  const response: AxiosResponse = await axios.get(
    "http://localhost:3000/db/items-by-user/" + id
  );
  if (response.data) {
    let d: Items[] = response.data;
    return d;
  }
};

const dbHooks = { getAllItems, getItemsByUser, getUsers };

export default dbHooks;
