const express = require("express");

const mysql = require("mysql");

const fs = require("fs");

const cors = require("cors");

//  Express

const PORT = process.env.PORT || 3001;

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

app.post("/signup", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  db.query("INSERT INTO chessusnode.users (username, password) VALUES (?,?)",
  [username, password],
  (err, result) => {
    console.log(err);
  })
});

app.post("/login", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  db.query("SELECT * FROM chessusnode.users WHERE username = ? AND password = ?",
  [username, password],
  (err, result) => {
    if (err) {
      res.send({ err: err});
    }

    if (result.length > 0) {
      res.send(result);
    } else {
      res.send({ message: "Wrong username/password combination!" });
    }
  })
});










//  -----------------------  Other/Port -------------------------

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.json({ message: "No data to return from this endpoint!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});