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

//Get user Items
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

//Delete item
app.post("/db/delete-item", (req, res) => {
  const { name, owner } = req.body;
  const sqlSelect: string = "DELETE FROM items WHERE owner = ? AND name = ?;";
  db.query(sqlSelect, [owner, name], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

//Add Item
app.post("/db/add-item", (req, res) => {
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

//Update item quantity
app.post("/db/update-item-quantity", (req, res) => {
  const { name, owner, quantity } = req.body;
  const sqlInsert: string =
    "UPDATE items SET quantity = quantity + ? WHERE owner = ? AND name= ?;";
  db.query(sqlInsert, [quantity, owner, name], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

//Get foodgroups
app.get("/db/foodgroups", (req, res) => {
  const sqlSelect: string =
    "SELECT json_arrayagg(foodgroup) AS foodgroups FROM (SELECT DISTINCT foodgroup from foods) a;";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

//Get food by foodgroup
app.get("/db/food-by-group", (req, res) => {
  const sqlSelect: string =
    "SELECT foodgroup, COUNT(name) as quantity, json_arrayagg(name) as 'foods' FROM foods GROUP BY foodgroup ORDER BY quantity DESC;";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

//Get items in foodgroup
app.post("/db/food", (req, res) => {
  const { foodgroup } = req.body;
  const sqlSelect: string = "SELECT name FROM foods WHERE foodgroup = ?";
  db.query(sqlSelect, [foodgroup], (err, result) => {
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
