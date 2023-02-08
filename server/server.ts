import express from "express";
import mysql2 from "mysql2";
import bodyParser from "body-parser";
import cors from "cors";

const port: number = 3000;

const app = express();
const db = mysql2.createPool({
  host: "localhost",
  user: "fridge",
  password: "fridgeSQLuser",
  database: "fridge",
});

//Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
app.get("/", (req, res) => {
  res.send("The Fridge Opens Ominously");
});

app.get("/db/userItems", (req, res) => {
  const sqlSelect: string =
    "SELECT users.name as user, users.id as id, JSON_ARRAYAGG(JSON_OBJECT('id', items.id, 'name', items.name, 'quantity', items.quantity)) AS 'items' from users JOIN items on users.id = items.owner GROUP BY users.id;";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.delete("/db/delete-item/:user/:item", (req, res) => {
  const { user, item } = req.params;
  const sqlSelect: string = "DELETE FROM items WHERE owner = ? AND id = ?;";
  db.query(sqlSelect, [user, item], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/db/add-item", (req, res) => {
  console.log(req.body);
  const { name, owner, quantity } = req.body;
  const sqlInsert: string =
    "INSERT INTO items (name, owner, quantity) VALUES (?,?,?);";
  db.query(sqlInsert, [name, owner, quantity], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

//Listener
app.listen(port, () => {
  console.log(`The Fridge Opens Ominously
         http://localhost:${port}/`);
});
