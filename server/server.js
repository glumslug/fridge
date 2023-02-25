import express from "express";
import mysql2 from "mysql2";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { protect } from "./authMiddleware.js";
dotenv.config();

const port = 3000;
const app = express();
const db =
  process.env.NODE_ENV === "development"
    ? mysql2.createPool({
        host: "localhost",
        user: "fridge",
        password: "fridgeSQLuser",
        database: "fridge",
      })
    : mysql2.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      });
console.log(db);
//Middleware
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
app.get("/", (req, res) => {
  res.send("The Fridge Opens Ominously");
});

//Get user Items
app.get("/db/userItems", (req, res) => {
  const sqlSelect =
    "SELECT u.name as name, u.id as id, JSON_ARRAYAGG(JSON_OBJECT('bin', p.bin, 'id', i.id, 'name', p.name, 'quantity', i.quantity, 'product', i.product)) AS 'items' from users u JOIN items i on u.id = i.owner JOIN products p on p.id = i.product GROUP BY u.id HAVING u.id = 1;";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

//Get user Items
app.get("/db/items", protect, (req, res) => {
  const sqlSelect =
    "SELECT u.name as name, u.id as id, JSON_ARRAYAGG(JSON_OBJECT('bin', p.bin, 'id', i.id, 'name', p.name, 'quantity', i.quantity, 'product', i.product)) AS 'items' from users u JOIN items i on u.id = i.owner JOIN products p on p.id = i.product GROUP BY u.id HAVING u.id = ?;";
  db.query(sqlSelect, [req.user], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      console.log(req.user);
      res.send(result[0]);
    }
  });
});

//Delete item
app.post("/db/delete-item", (req, res) => {
  const { product, owner } = req.body;
  const sqlSelect = "DELETE FROM items WHERE owner = ? AND product = ?;";
  db.query(sqlSelect, [owner, product], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

//Add Item
app.post("/db/add-item", (req, res) => {
  const { product, owner, quantity } = req.body;
  const sqlInsert =
    "INSERT INTO items (product, owner, quantity) VALUES (?,?,?);";
  db.query(sqlInsert, [product, owner, quantity], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

//Update item quantity
app.post("/db/update-item-quantity", (req, res) => {
  const { product, owner, quantity } = req.body;
  const sqlInsert =
    "UPDATE items SET quantity = quantity + ? WHERE owner = ? AND product= ?;";
  db.query(sqlInsert, [quantity, owner, product], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

//Get foodgroups
app.get("/db/foodgroups", (req, res) => {
  const sqlSelect =
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
  const sqlSelect =
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
  const sqlSelect = "SELECT name FROM foods WHERE foodgroup = ?";
  db.query(sqlSelect, [foodgroup], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

//Login a user
app.post("/db/login", (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    res.send("Please type your email!");
  }
  if (!password) {
    res.send("Please type your password!");
  }

  const sqlSelect = "SELECT * FROM users WHERE email = ?;";
  db.query(sqlSelect, [email], async (err, result) => {
    if (err) {
      res.send(err);
    } else {
      const user = result[0];

      if (!user) {
        res.status(400);
        res.send("User doesn't exist!");
      } else {
        if (await bcrypt.compare(password, user.password)) {
          res.send({
            id: user.id,
            name: user.name,
            token: generateToken(user.id, "15m"),
          });
        } else {
          res.status(400);
          res.send("Wrong password!");
        }
      }
    }
  });
});

// Register a user
app.post("/db/register", async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const sqlInsert =
    "INSERT INTO users (email, password, name) VALUES (?, ?, ?);";
  db.query(sqlInsert, [email, hashedPassword, name], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      db.query(
        "SELECT id, name FROM users WHERE email = ?",
        [email],
        (err, result) => {
          if (err) {
            res.send(err);
          } else {
            const user = result[0];
            res.send({
              id: user.id,
              name: user.name,
              token: generateToken(user.id, "15m"),
            });
          }
        }
      );
    }
  });
});

// Generate JWT
const generateToken = (id, exp) => {
  const period = exp ? exp : "30d";
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: period,
  });
};

//Listener
app.listen(port, () => {
  console.log(`Listening on port ${port}, ${process.env.NODE_ENV}`);
});
