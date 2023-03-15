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

//Get full context
app.get("/db/fullContext", protect, (req, res) => {
  const id = req.user;
  const sqlSelect =
    "SELECT 'items', JSON_ARRAYAGG(JSON_OBJECT('product', p.id, 'bin', p.bin, 'id', i.id, 'name', p.name, 'quantity', i.quantity)) AS 'contents' from users u LEFT JOIN items i on u.id = i.owner LEFT JOIN products p on p.id = i.product GROUP BY u.id HAVING u.id = ? UNION select 'cart', JSON_ARRAYAGG(JSON_OBJECT('product', p.id, 'name', p.name, 'bin', p.bin, 'quantity', c.quantity)) as 'cart' from cart c LEFT join products p on c.product = p.id LEFT join users u on c.owner = u.id GROUP BY u.id HAVING u.id = ? UNION select 'myRecipes', JSON_ARRAYAGG(JSON_OBJECT('id', r.id, 'title', r.name, 'cuisine', r.cuisine, 'author_name', u.name, 'author_id', r.author, 'author_alias', a.alias)) as 'recipes' from recipes r LEFT join users u on r.author = u.id JOIN authors a on a.id = r.author GROUP by u.id HAVING u.id = ? UNION SELECT 'savedRecipes', JSON_ARRAYAGG(JSON_OBJECT('id', sr.id, 'author_id', r.author, 'author_name', u.name, 'author_alias', a.alias,'cuisine', r.cuisine, 'title', r.name, 'recipe_id', sr.recipe )) as 'savedRecipes' from savedRecipes sr left join recipes r on sr.recipe = r.id LEFT JOIN authors a on r.author = a.id LEFT JOIN users u on u.id = a.user group by sr.user having sr.user = ?";
  db.query(sqlSelect, [id, id, id, id], (err, result) => {
    if (err) {
      res.status(400);
      res.send(err);
    } else {
      const cart = result.find((u) => u.items == "cart")?.contents || [];
      const items = result.find((u) => u.items == "items")?.contents || [];
      const myRecipes =
        result.find((u) => u.items == "myRecipes")?.contents || [];
      const savedRecipes =
        result.find((u) => u.items == "savedRecipes")?.contents || [];
      // res.send(items);
      res.send({
        items: {
          freezer: items.filter((item) => item.bin == "freezer"),
          fridge: items.filter((item) => item.bin == "fridge"),
          pantry: items.filter((item) => item.bin == "pantry"),
          closet: items.filter((item) => item.bin == "closet"),
        },
        cart: {
          freezer: cart.filter((item) => item.bin == "freezer"),
          fridge: cart.filter((item) => item.bin == "fridge"),
          pantry: cart.filter((item) => item.bin == "pantry"),
          closet: cart.filter((item) => item.bin == "closet"),
        },
        myRecipes: myRecipes,
        savedRecipes: savedRecipes,
      });
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

//Upsert Item
app.post("/db/upsertItem", (req, res) => {
  const { product, owner, quantity } = req.body;
  const sqlSelect = "CALL upsertItem(?,?,?);";
  db.query(sqlSelect, [product, owner, quantity], (err, result) => {
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

//Add cart_item
app.post("/db/cart/add", protect, (req, res) => {
  const { product, quantity } = req.body;
  const sqlInsert =
    "insert into cart (owner, product, quantity) values (?, ?, ?);";
  db.query(sqlInsert, [req.user, product, quantity], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

//Update cart_item
app.post("/db/cart/update", protect, (req, res) => {
  const { product, quantity } = req.body;
  const sqlUpdate =
    "UPDATE cart SET quantity = ? WHERE owner = ? AND product = ?;";
  db.query(sqlUpdate, [quantity, req.user, product], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

//Update cart_item
app.post("/db/cart/remove", protect, (req, res) => {
  const { product, quantity } = req.body;
  const sqlDelete = "DELETE FROM cart WHERE owner = ? AND product = ?;";
  db.query(sqlDelete, [req.user, product], (err, result) => {
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

//Get all? products
app.get("/db/products", (req, res) => {
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

app.get("/db/shoppingList", protect, (req, res) => {
  const sqlSelect =
    "select JSON_ARRAYAGG(JSON_OBJECT('product', p.name, 'product_id', p.id, 'bin', p.bin, 'quantity', li.quantity)) as 'cart' from lists l join list_items li on l.id = li.list join products p on li.product = p.id GROUP BY l.owner HAVING l.owner = ?;";
  db.query(sqlSelect, [req.user], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      let cart = result[0].cart;
      let freezer = cart.filter((item) => item.bin == "freezer");
      let fridge = cart.filter((item) => item.bin == "fridge");
      let pantry = cart.filter((item) => item.bin == "pantry");
      let closet = cart.filter((item) => item.bin == "closet");
      res.send({
        freezer: freezer,
        fridge: fridge,
        pantry: pantry,
        closet: closet,
      });
    }
  });
});

//Login a user OLD
app.post("/db/loginOLD", (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    res.send("Please type your email!");
  }
  if (!password) {
    res.send("Please type your password!");
  }

  const sqlSelect =
    "SELECT u.email as email, 'user', json_object('password', u.password, 'id', u.id, 'email', u.email, 'name', u.name) as 'contents' from users u where u.email = ? UNION SELECT u.email as email, 'items', JSON_ARRAYAGG(JSON_OBJECT('bin', p.bin, 'product', p.id, 'name', p.name, 'quantity', i.quantity)) AS 'items' from users u LEFT JOIN items i on u.id = i.owner LEFT JOIN products p on p.id = i.product GROUP BY u.id HAVING u.email = ? UNION select u.email as email, 'cart', JSON_ARRAYAGG(JSON_OBJECT('product', p.id,'name', p.name, 'bin', p.bin, 'quantity', c.quantity)) as 'cart' from cart c join products p on c.product = p.id join users u on c.owner = u.id GROUP BY u.id HAVING u.email = ?;";
  db.query(sqlSelect, [email, email, email], async (err, result) => {
    if (err) {
      res.send(err);
    } else {
      const user = result[0].contents;
      const items = result[1]?.contents || [];
      const cart = result[2]?.contents || [];

      if (!user) {
        res.status(400);
        res.send("User doesn't exist!");
      } else {
        if (await bcrypt.compare(password, user.password)) {
          res.send({
            id: user.id,
            name: user.name,
            token: generateToken(user.id),
            items: {
              freezer: items.filter((item) => item.bin == "freezer"),
              fridge: items.filter((item) => item.bin == "fridge"),
              pantry: items.filter((item) => item.bin == "pantry"),
              closet: items.filter((item) => item.bin == "closet"),
            },
            cart: {
              freezer: cart.filter((item) => item.bin == "freezer"),
              fridge: cart.filter((item) => item.bin == "fridge"),
              pantry: cart.filter((item) => item.bin == "pantry"),
              closet: cart.filter((item) => item.bin == "closet"),
            },
          });
        } else {
          res.status(400);
          res.send("Email and password don't match!");
        }
      }
    }
  });
});

//Login a user
app.post("/db/login", (req, res) => {
  const { email, password } = req.body;
  const sqlSelect =
    "SELECT u.email as email, u.password as password, u.id as id, u.name as name from users u where u.email = ?;";
  db.query(sqlSelect, [email], async (err, result) => {
    if (err) {
      res.send(err);
    } else {
      if (result.length < 1) {
        res.status(400);
        res.send("User doesn't exist!");
      } else {
        const user = result[0];
        if (await bcrypt.compare(password, user.password)) {
          const id = user.id;
          const sqlSelect2 =
            "SELECT 'items', JSON_ARRAYAGG(JSON_OBJECT('product', p.id, 'bin', p.bin, 'id', i.id, 'name', p.name, 'quantity', i.quantity)) AS 'contents' from users u LEFT JOIN items i on u.id = i.owner LEFT JOIN products p on p.id = i.product GROUP BY u.id HAVING u.id = ? UNION select 'cart', JSON_ARRAYAGG(JSON_OBJECT('product', p.id, 'name', p.name, 'bin', p.bin, 'quantity', c.quantity)) as 'cart' from cart c LEFT join products p on c.product = p.id LEFT join users u on c.owner = u.id GROUP BY u.id HAVING u.id = ? UNION select 'myRecipes', JSON_ARRAYAGG(JSON_OBJECT('id', r.id, 'title', r.name, 'cuisine', r.cuisine, 'author_name', u.name, 'author_id', r.author, 'author_alias', a.alias)) as 'recipes' from recipes r LEFT join users u on r.author = u.id JOIN authors a on a.id = r.author GROUP by u.id HAVING u.id = ? UNION SELECT 'savedRecipes', JSON_ARRAYAGG(JSON_OBJECT('id', sr.id, 'author_id', r.author, 'author_name', u.name, 'author_alias', a.alias,'cuisine', r.cuisine, 'title', r.name, 'recipe_id', sr.recipe )) as 'savedRecipes' from savedRecipes sr left join recipes r on sr.recipe = r.id LEFT JOIN authors a on r.author = a.id LEFT JOIN users u on u.id = a.user group by sr.user having sr.user = ?";
          db.query(sqlSelect2, [id, id, id, id], (err, result) => {
            if (err) {
              res.status(400);
              res.send(err);
            } else {
              const cart =
                result.find((u) => u.items == "cart")?.contents || [];
              const items =
                result.find((u) => u.items == "items")?.contents || [];
              const myRecipes =
                result.find((u) => u.items == "myRecipes")?.contents || [];
              const savedRecipes =
                result.find((u) => u.items == "savedRecipes")?.contents || [];
              // res.send(items);
              res.send({
                id: user.id,
                name: user.name,
                token: generateToken(user.id),
                items: {
                  freezer: items.filter((item) => item.bin == "freezer"),
                  fridge: items.filter((item) => item.bin == "fridge"),
                  pantry: items.filter((item) => item.bin == "pantry"),
                  closet: items.filter((item) => item.bin == "closet"),
                },
                cart: {
                  freezer: cart.filter((item) => item.bin == "freezer"),
                  fridge: cart.filter((item) => item.bin == "fridge"),
                  pantry: cart.filter((item) => item.bin == "pantry"),
                  closet: cart.filter((item) => item.bin == "closet"),
                },
                myRecipes: myRecipes,
                savedRecipes: savedRecipes,
              });
            }
          });
        } else {
          res.status(400);
          res.send("Email and password don't match!");
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
              token: generateToken(user.id),
              items: {
                freezer: [],
                fridge: [],
                pantry: [],
                closet: [],
              },
              cart: {
                freezer: [],
                fridge: [],
                pantry: [],
                closet: [],
              },
              myRecipes: [],
              savedRecipes: [],
            });
          }
        }
      );
    }
  });
});

// search products
app.post("/db/products", async (req, res) => {
  const { search } = req.body;
  const reg = "^" + search;
  const sqlQuery =
    "SELECT id as product, bin, name FROM products WHERE name REGEXP ?;";
  db.query(sqlQuery, [reg], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

// search recipes
app.post("/db/recipes", async (req, res) => {
  const { search } = req.body;
  const reg = "^" + search;
  const sqlQuery =
    "SELECT r.id as id, r.name as title, r.cuisine as cuisine, u.name as author_name, r.author as author_id, a.alias as author_alias from recipes r LEFT JOIN authors a on r.author = a.id LEFT JOIN users u on a.user = u.id WHERE r.name REGEXP ?;";
  db.query(sqlQuery, [reg], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

// get recipe details
app.get("/db/recipes/:id", async (req, res) => {
  const { id } = req.params;
  const sqlSelect =
    "SELECT i.id as ingredient_id, p.id as product_id, p.name as name, i.amount as amount, un.short as unit_short, un.singular as unit_singular, un.plural as unit_plural from recipes r join ingredients i on r.id = i.recipe join products p on p.id = i.product join units un on un.id = i.unit where r.id = ?;";
  db.query(sqlSelect, [id], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
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
