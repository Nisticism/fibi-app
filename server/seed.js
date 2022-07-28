const fs = require("fs");
const express = require("express");
const mysql = require("mysql");

const app = express();
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  port: '3306'
});


// Read SQL table seed query
const tableQuery = fs.readFileSync("db/tables-seed.sql", {
  encoding: "utf-8",
})

// Run tables-seed.sql

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

// Run seed.sql

app.get('/seed', (req, res) => {
  let sql = seedQuery;
  db.query(sql, err => {
    if (err) {
      throw err;
    }
    res.send("Seed data created or exist");
  })
})