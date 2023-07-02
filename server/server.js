const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const db = new sqlite3.Database("./dermed.db");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

db.serialize(() => {
  db.run("SELECT 1", (err) => {
    if (err) {
      console.error("Chyba při připojení k databázi:", err.message);
    } else {
      console.log("Připojení k databázi bylo úspěšné.");
    }
  });
});

function checkAuthentication(req, res, next) {
  if (req.session.username) {
    next();
  } else {
    res.redirect("/login.html");
  }
}

app.get("/dashboard.html", checkAuthentication, function (req, res) {
  res.sendFile(path.join(__dirname, "public/dashboard.html"));
});

app.get("/check-auth", (req, res) => {
  if (req.session.username) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

app.post("/login", (req, res) => {
  console.log("Přijatá data z /login:", req.body);

  db.get(
    "SELECT password FROM admins WHERE username = ?",
    [req.body.username],
    (err, row) => {
      if (err) {
        console.error("Chyba při dotazu do databáze:", err.message);
        res.status(400).json({ error: err.message });
        return;
      }
      if (!row) {
        console.log("Neznámý uživatel:", req.body.username);
        res.json({ status: "error", message: "Neznámý uživatel" });
        return;
      }
      const result = bcrypt.compareSync(req.body.password, row.password);
      if (result) {
        console.log("Přihlášení úspěšné pro uživatele:", req.body.username);
        req.session.username = req.body.username;
        res.json({ status: "success" });
      } else {
        console.log("Nesprávné heslo pro uživatele:", req.body.username);
        res.json({ status: "error", message: "Nesprávné heslo" });
      }
    }
  );
});

app.get("/posts", (req, res) => {
  db.all("SELECT * FROM posts", [], (err, rows) => {
    if (err) {
      console.error("Chyba při dotazu do databáze:", err.message);
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/post", checkAuthentication, (req, res) => {
  console.log("Přijatá data z /post:", req.body);

  db.run(
    "INSERT INTO posts (date, title, content) VALUES (?, ?, ?)",
    [req.body.date, req.body.title, req.body.content],
    function (err) {
      if (err) {
        console.error("Chyba při vkládání záznamu do databáze:", err.message);
        res.status(400).json({ error: err.message });
        return;
      }
      console.log("Záznam úspěšně vložen do databáze.");
      res.json({ status: "success" });
    }
  );
});

app.delete("/post/:id", checkAuthentication, (req, res) => {
  console.log("ID záznamu k odstranění:", req.params.id);

  db.run("DELETE FROM posts WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      console.error("Chyba při mazání záznamu z databáze:", err.message);
      res.status(400).json({ error: err.message });
      return;
    }
    console.log("Záznam úspěšně odstraněn z databáze.");
    res.json({ status: "success" });
  });
});

app.listen(3005, () => {
  console.log("Server běží na http://localhost:3005");
});
