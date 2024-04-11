require("dotenv").config();

//  Constants

const express = require("express");

const mysql = require("mysql");

const fs = require("fs");

const cors = require("cors");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

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
  let sql = 'CREATE DATABASE IF NOT EXISTS Fibi'
  db.query(sql, err => {
    if (err) {
      throw err;
    }
    res.send("Database Created or Exists");
  })
})


//  -----------  Seeding/Tables -----------------

// Read SQL table seed query
// const tableQuery = fs.readFileSync("db/tables-seed.sql", {
//   encoding: "utf-8",
// })

// Run tables-seed.sql.  Go to /create-tables to create the tables.
// app.get('/create-tables', (req, res) => {
//   let sql = tableQuery;
//   db.query(sql, err => {
//     if (err) {
//       throw err;
//     }
//     res.send("Tables Created or Exist");
//   })
// })

// Read SQL seed query
// const seedQuery = fs.readFileSync("db/seed.sql", {
//   encoding: "utf-8",
// })

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
app.use(express.static(path.resolve(__dirname, '../fibi-frontend/public')));



//  ------------------ Routes --------------------------

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/", (req, res) => {
  res.json({ message: "Home page!" });
})

app.get("/user", (params, res) => {
  const username = params.query.username;
  db.query("SELECT * FROM Fibi.users WHERE username = ?",
  [username],
  (err, result) => {
    if (err) {
      res.send({ err: err});
    }
    if (!result.length > 0) {
      res.status(400).send({ auth: false, message: "Username does not exist" });
    } else {
      try {
        res.json({ result: result[0], message: "User found" });
      } catch {
        res.status(500).send()
      }
    }
  })
});

app.get("/users", (req, res) => {

  db.query("SELECT * FROM Fibi.users",
  (err, result) => {
    if (err) {
      res.send({ err: err});
    }
    let users = result;
    res.json(users);
  });
})

// app.post("/users", (req, res) => {

// })

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  let user;
  let hashedPassword;

  db.query("SELECT * FROM Fibi.users WHERE username = ?",
  [username],
  (err, result) => {
    if (err) {
      res.send({ err: err});
    }
    if (result.length > 0) {
      if (result[0].username.length === 0) {
        res.status(500).send({ message: "Username cannot be blank" });
      } else {
        res.status(500).send({ message: "Username already exists" });
      }
    } else {
      db.query("SELECT * FROM Fibi.users WHERE email = ?",
      [email],
        (err, result) => {
          if (err) {
            res.send({message: "error", err: err});
          }
          if (result.length > 0) {
            res.status(500).send({ message: "Email already taken" });
          } else {
            try {
              const salt = bcrypt.genSaltSync();
              hashedPassword = bcrypt.hashSync(password, salt)
              console.log(hashedPassword);
              user = { username: username, password: hashedPassword, email: email }
            } catch {
              res.status(500).send()
            }
            db.query("INSERT INTO Fibi.users (username, password, email) VALUES (?,?,?)",
            [username, hashedPassword, email],
              (err, result) => {
                console.log(err);
                console.log(result);
                res.status(201).send(user);
              }
            );
          }
        }
      );
    }
  });
});

app.post("/profile/edit", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log("the password is still" + password);
  const email = req.body.email;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const phone = req.body.phone;
  const id = req.body.id;
  console.log("in the edit backend")

  let user;
  let hashedPassword;

  db.query("SELECT * FROM Fibi.users WHERE username = ?",
  [username],
  (err, result) => {
    if (err) {
      res.send({ err: err});
    }
    if (result.length > 0 && result[0].username != username) {
        res.status(500).send({ message: "Username already taken" });
    } else {
      if (username.length < 1) {
        res.status(500).send({ message: "Username must be between 1 and 20 characters" });
      }
      db.query("SELECT * FROM Fibi.users WHERE email = ?",
      [email],
        (err, result) => {
          if (err) {
            res.send({message: "error", err: err});
          }
          if (result.length > 0 && result[0].email != email) {
            if (result[0].email != email) {
              res.status(500).send({ message: "Email already taken" });
            }
          } else {
            try {
              const salt = bcrypt.genSaltSync();
              hashedPassword = bcrypt.hashSync(password, salt)
              // console.log(hashedPassword);
              user = { username: username, password: hashedPassword, email: email, first_name: first_name, last_name: last_name, phone: phone, id: id}
            } catch {
              res.status(500).send()
            }
            if (password && password.length > 0) {
              db.query("UPDATE Fibi.users SET username = ?, password = ?, email = ?, first_name = ?, last_name = ?, phone = ? WHERE id = ?",
              [username, hashedPassword, email, first_name, last_name, phone, id],
                (err, result) => {
                  console.log(err);
                  console.log(result);
                  res.json({ auth: true, result: user });
                  // res.status(201).send(user);
                }
              ); 
            } else {
              db.query("UPDATE Fibi.users SET username = ?, email = ?, first_name = ?, last_name = ?, phone = ? WHERE id = ?",
              [username, email, first_name, last_name, phone, id],
                (err, result) => {
                  console.log(err);
                  console.log(result);
                  res.json({ auth: true, result: user });
                  // res.status(201).send(user);
                }
              );
            }
          }
        }
      );
    }
  });
});

app.post("/login", async (req, res) => {
  console.log("in index.js server login");
  const username = req.body.username;
  const password = req.body.password;
  console.log(`username: ${username} password: ${password}`);
  db.query("SELECT * FROM Fibi.users WHERE username = ?",
  [username],
  (err, result) => {
    if (err) {
      res.send({ err: err});
    }
    if (!result.length > 0) {
      res.status(400).send({ auth: false, message: "Username does not exist" });
    } else {
      console.log("at least we found a user");
      //  If the username exists, check everything else:
      try {
        if (bcrypt.compareSync(password, result[0].password)) {
          console.log("succeeded!");
          const user = { username: username, password: password };
          console.log(user);
          const accessToken = generateAccessToken(user);
          console.log("succeeded!");
          // const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
          result[0].accessToken = accessToken;
          res.json({ auth: true, result: result[0] });
        } else {
          console.log("we are in the failed login backend method");
          res.status(400).send({auth: false, message: "Incorrect password"});
        }
      } catch {
        res.status(500).send()
      }
    }
  })
});

app.post("/delete", async (req, res) => {
  const username = req.body.username;
  db.query("DELETE FROM Fibi.users WHERE username = ?",
  [username],
  (err, result) => {
    if (err) {
      res.send({ err: err});
    }
    else {
      res.json({message: "Account deleted"});
    }
  })
})

app.post('/logout', (req, res) => {
  console.log("You have been logged out");
});

const posts = [{
  username: 'NewAccount',
  title: "Post 1"
},
{
  username: "NewAccount2",
  title: "Post 2"
}]

// app.get('/posts', authenticateToken, (req, res) => {
//   res.json(posts.filter(post => post.username === req.user.username))
// })

//  ---------------------- Forums ---------------------------------

app.post("/forums/new", async (req, res) => {
  const title = req.body.title;
  // const genre = req.body.genre;
  const content = req.body.content;
  const created_at = req.body.created_at;
  const author_id = req.body.author_id;
  console.log(content);
  // const game_type_id = req.body.game_type_id;
  // const public = req.body.public_setting;
  // const description = req.body.description;
  let forum;
  forum = { author_id: author_id, title: title, content: content, created_at: created_at}

  db.query("INSERT INTO Fibi.articles (author_id, title, content, created_at) VALUES (?,?,?,?)",
    [author_id, title, content, created_at],
    (err, result) => {
      if (err) {
        res.send({ err: err});
      }
      console.log(result);
      res.json({result: forum });
    }
  );
});

app.get("/forums", (req, res) => {
  db.query("SELECT * FROM Fibi.articles",
  (err, result) => {
    if (err) {
      res.send({ err: err});
    } else {
      let forums = [];
      result.forEach((forum, index, array) => {
        let author_name = "";
        let comment_count = 0;
        let likes;
        db.query("SELECT * FROM Fibi.comments WHERE article_id = ?", [forum.id], (err, result) => {
          if (err) {
            res.send({ err: err });
          } else {
            comment_count = result.length;
          }
        })
        db.query("SELECT * FROM Fibi.likes WHERE article_id = ?", [forum.id], (err, result) => {
          if (err) {
            res.send({ err: err });
          } else {
            likes = result;
          }
        })
        db.query("SELECT * FROM Fibi.users WHERE id = ?", [forum.author_id], (err, result) => {
          if (err) {
            res.send({ err: err });
          } else {
            author_name = result[0].username;
            forum.author_name = author_name;
            forum.comment_count = comment_count;
            forum.likes = likes;
            forums.push(forum);
            // On the last iteraction, run this
            if (index === array.length - 1) {
              res.json(forums);
            }
          }
        })
      })
      console.log("in get all forums route.  Forums: " + forums)
    }
  });
});

app.get("/forum", (params, res) => {
  console.log("in get forum route");
  const forum_id = params.query.forum_id;
  console.log("forum id: " + forum_id);
  db.query("SELECT * FROM Fibi.articles WHERE id = ?",
  [forum_id],
  (err, result) => {
    if (err) {
      res.send({ err: err});
    }
    if (!result.length > 0) {
      res.status(400).send({ auth: false, message: "Forum post does not exist" });
    } else {
      try {
        let forum = result[0];

        // get author name

        db.query("SELECT * FROM Fibi.users WHERE id = ?",
        [forum.author_id],
        (err, result) => {
          if (err) {
            res.send({ err: err});
          }
          if (!result.length > 0) {
            res.status(400).send({ auth: false, message: "Author of forum post does not exist" });
          } else {
            try {
              let author = result[0].username;
              forum.author_name = author;
              console.log(forum);
            } catch {
              res.status(500).send()
            }
          }
        })

        // get likes

        db.query("SELECT * FROM Fibi.likes WHERE article_id = ?",
        [forum_id],
        (err, result) => {
          if (err) {
            res.send({ err: err});
          } else {
            try {
              forum.likes = result;
            } catch {
              res.status(500).send()
            }
          }
        })

        // get all comments of forum

        db.query("SELECT * FROM Fibi.comments WHERE article_id = ?",
        [forum.id],
        (err, result) => {
          if (err) {
            res.send({ err: err});
          } else {
            try {
              let comments = result;
              console.log("got the comments")
              console.log(comments);

              //  get all the author names of all the comments
              if (comments.length > 0) {
                comments.forEach((comment, index, array) => {
                  db.query("SELECT * FROM Fibi.users WHERE id = ?", [comment.author_id], (err, result) => {
                    if (err) {
                      res.send({ err: err });
                    } else {
                      console.log("in getting author names of comments")
                      comment.author_name = result[0].username;
                      //  On the last iteration, run this
                      if (index === array.length - 1) {
                        forum.comments = comments;
                        //  Send result
                        console.log("Forum before json send: " + forum);
                        res.json({ result: forum, message: "Forum found" });
                      }
                    }
                  })
                })
              } else {
                console.log("Forum before json send: " + forum);
                res.json({ result: forum, message: "Forum found" });
              }

            } catch {
              res.status(500).send()
            }
          }
        })

      } catch {
        res.status(500).send()
      }
    }
  })
});

app.put("/forums/edit", async (req, res) => {
  const title = req.body.title;
  const id = req.body.id;
  const content = req.body.content;
  const last_updated_at = req.body.last_updated_at;
  console.log(content);
  console.log("in edit forum route")
  let forum = {title: title, content: content, last_updated_at: last_updated_at, id: id};
  db.query("UPDATE Fibi.articles SET title = ?, content = ?, last_updated_at = ? WHERE id = ?",
    [title, content, last_updated_at, id],
    (err, result) => {
      if (err) {
        res.send({ err: err});
      }
      console.log(result);
      console.log("forum: " + forum.title + "content: " + forum.content + "last updated: " + forum.last_updated_at, "id: " + id)
      res.json({result: forum });
    }
  );
});

app.post("/forums/delete", async (req, res) => {
  console.log("in delete post route")
  console.log(req.body);
  const id = req.body.id;
  console.log(id);
  db.query("DELETE FROM Fibi.comments WHERE article_id = ?",
  [id],
  (err, result) => {
    if (err) {
      res.send({ err: err});
    }
    else {
      db.query("DELETE FROM Fibi.likes WHERE article_id = ?",
      [id],
      (err, result) => {
        if (err) {
          res.send({ err: err});
        } else {
          db.query("DELETE FROM Fibi.articles WHERE id = ?",
          [id],
          (err, result) => {
            if (err) {
              res.send({ err: err});
            }
            else {
              console.log("post deleted");
              res.json({message: "Post deleted"});
            }
          })
        }
      })
    }
  })
});




// ----------------------- Comments ---------------------------


app.post("/comments/new", async (req, res) => {
  const author_id = req.body.author_id;
  const forum_id = req.body.forum_id;
  const content = req.body.content;
  const created_at = req.body.created_at;
  const author_name = req.body.author_name;

  db.query("INSERT INTO Fibi.comments (author_id, article_id, content, created_at, last_updated_at) VALUES (?,?,?,?,?)",
    [author_id, forum_id, content, created_at, created_at],
    (err, result) => {
      if (err) {
        res.send({ err: err});
      }
      let comment;
      comment = { id: result.insertId, author_id: author_id, article_id: forum_id, content: content, created_at: created_at, last_updated_at: created_at, author_name: author_name}
      console.log(result);
      res.json({result: comment });
    }
  );
});

app.post("/delete-comment", async (req, res) => {
  console.log("in delete comment route")
  const id = req.body.id;
  db.query("DELETE FROM Fibi.comments WHERE id = ?",
  [id],
  (err, result) => {
    if (err) {
      res.send({ err: err});
    }
    else {
      res.json({message: "Comment deleted"});
    }
  })
});

app.put("/comments/edit", async (req, res) => {
  const id = req.body.id;
  const content = req.body.content;
  const last_updated_at = req.body.last_updated_at;

  db.query("UPDATE Fibi.comments SET content = ?, last_updated_at = ? WHERE id = ?",
    [content, last_updated_at, id],
    (err, result) => {
      if (err) {
        res.send({ err: err});
      }
      let comment_update;
      comment_update = { id: id, content: content, last_updated_at: last_updated_at};
      console.log(result);
      res.json({result: comment_update });
    }
  );
});



// ----------------------- Likes ----------------------------

app.post("/likes/new", async (req, res) => {
  const user_id = req.body.user_id;
  const article_id = req.body.article_id;
  const liked = true;
  db.query("INSERT INTO Fibi.likes (user_id, article_id, liked) VALUES (?,?,?)",
    [user_id, article_id, liked],
    (err, result) => {
      if (err) {
        res.send({ err: err});
      }
      let like;
      like = { id: result.insertId, user_id: user_id, article_id: article_id, liked: liked}
      console.log(result);
      res.json({result: like });
    }
  );
});

app.post("/likes/delete", async (req, res) => {
  console.log("in delete likes route")
  const id = req.body.id;
  db.query("DELETE FROM Fibi.likes WHERE id = ?",
  [id],
  (err, result) => {
    if (err) {
      res.send({ err: err});
    }
    else {
      res.json({message: "Like deleted"});
    }
  })
});


//  ---------------------- News ------------------------------

app.post("/news/new", async (req, res) => {
  const author = req.body.author;
  const article_id = req.body.article_id;
  const liked = true;
  db.query("INSERT INTO Fibi.news (user_id, article_id, liked) VALUES (?,?,?)",
    [user_id, article_id, liked],
    (err, result) => {
      if (err) {
        res.send({ err: err});
      }
      let news;
      news = { id: result.insertId, user_id: user_id, article_id: article_id, liked: liked}
      console.log(result);
      res.json({result: news });
    }
  );
});


app.get("/news", (req, res) => {
  db.query("SELECT * FROM Fibi.news",
  (err, result) => {
    if (err) {
      res.send({ err: err});
    } else {
      if (result.length > 0) {
        console.log("In get news route");
        let news = result;
        res.json({news: news});
      } else {
        res.json({message: "No news to be found"})
      }
    }
  });
});

//  ---------------------- Token -----------------------------

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
})

// ----------------------- Middleware ------------------------------

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) {
    res.send("No token!");
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

function generateAccessToken(user) {
  console.log("in generate access token")
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '500s' });
}

//  -----------------------  Other/Port -------------------------

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.json({ message: "No data to return from this endpoint!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});