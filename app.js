const express = require(`express`);
const path = require("path");
const bodyparser = require("body-parser");
const session = require("express-session");
const nocache = require("nocache");
const { v4: uuidv4 } = require("uuid");
const router = require("./router");

const app = express();

const port = process.env.PORT || 3000;

//middlewares

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

//load static assets
app.use("/static", express.static(path.join(__dirname, "public")));

app.use(nocache());

app.use(
  session({
    // We can use uuid to make secret string
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

app.use("/route", router);

app.get("/", (req, res) => {
  // console.log(req.session.user, "yes");
  if (req.session.user) {
    res.redirect("/route/login");
  }

  res.render("login", { msg: null });
});

app.listen(port, () => {
  console.log(`The server started at http://localhost:${port}`);
});
