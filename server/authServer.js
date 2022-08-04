require("dotenv").config();

//  Constants

const express = require("express");

const mysql = require("mysql");

const fs = require("fs");

const cors = require("cors");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

//  Express

const PORT = process.env.PORT || 4001;

const app = express();

const path = require('path');

app.use(express.json());
app.use(cors());

//  DB

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  port: '3306'
});

db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected')
})

// Create Database

app.get('/create-db', (req, res) => {
  let sql = 'CREATE DATABASE IF NOT EXISTS ChessusNode'
  db.query(sql, err => {
    if (err) {
      throw err;
    }
    res.send("Database Created or Exists");
  })
})


//  -----------  Seeding/Tables -----------------

// Read SQL table seed query
const tableQuery = fs.readFileSync("db/tables-seed.sql", {
  encoding: "utf-8",
})

// Run tables-seed.sql.  Go to /create-tables to create the tables.
app.get('/create-tables', (req, res) => {
  let sql = tableQuery;
  db.query(sql, err => {
    if (err) {
      throw err;
    }
    res.send("Tables Created or Exist");
  })
})

// Read SQL seed query
const seedQuery = fs.readFileSync("db/seed.sql", {
  encoding: "utf-8",
})

// Run seed.sql.  Go to /seed to create seed data.
app.get('/seed', (req, res) => {
  let sql = seedQuery;
  db.query(sql, err => {
    if (err) {
      throw err;
    }
    res.send("Seed data created or exist");
  })
})

//  ----------------- End of seeding/tables ----------------------



// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../chessus-frontend/public')));



//  ------------------ Routes --------------------------

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/", (req, res) => {
  res.json({ message: "Home page!" });
})

const users = [];

app.get("/users", authenticateToken, (req, res) => {
  res.json(users);
})

app.post("/users", (req, res) => {

})

app.post("/signup", async (req, res) => {
  const username = req.body.username;
  let user;
  let hashedPassword;

  db.query("SELECT * FROM chessusnode.users WHERE username = ?",
  [username],
  (err, result) => {
    if (err) {
      res.send({ err: err});
    }
    if (result.length > 0) {
      res.status(500).send({ message: "Username already exists." });
      // res.send(result);
      // jwt.sign()
    } else {
      try {
        const password = req.body.password;
        const salt = bcrypt.genSaltSync();
        hashedPassword = bcrypt.hashSync(password, salt)
        console.log(salt);
        console.log(hashedPassword);
        user = { username: username, password: hashedPassword }
      } catch {
        res.status(500).send()
      }
      db.query("INSERT INTO chessusnode.users (username, password) VALUES (?,?)",
      [username, hashedPassword],
        (err, result) => {
          console.log(err);
          console.log(result);
          res.status(201).send(user);
        }
      );
    }
  });
});

app.post("/login", async (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  db.query("SELECT * FROM chessusnode.users WHERE username = ?",
  [username],
  (err, result) => {
    if (err) {
      res.send({ err: err});
    }
    if (!result.length > 0) {
      res.status(400).send({ message: "Username does not exist." });
    } else {
      //  If the username exists, check everything else:
      try {
        console.log(result[0].password);
        if(bcrypt.compareSync(password, result[0].password)) {
          const user = { username: username, password: password };
          const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
          res.json({ accessToken: accessToken });
          res.send(result);
        } else {
          res.send("Invalid password.");
        }
      } catch {
        res.status(500).send()
      }
    }
  })
});

const posts = [{
  username: 'NewAccount',
  title: "Post 1"
},
{
  username: "NewAccount2",
  title: "Post 2"
}]

app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.username))
})

// ----------------------- Middleware ------------------------------

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}








//  -----------------------  Other/Port -------------------------

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.json({ message: "No data to return from this endpoint!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});