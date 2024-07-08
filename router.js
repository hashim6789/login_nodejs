const { render } = require("ejs");
const express = require("express");
const router = express.Router();

const users = [
  {
    email: "admin@gmail.com",
    password: "123456",
  },
  {
    email: "hashim@gmail.com",
    password: "321123",
  },
];

// Middleware to prevent caching
const noCache = (req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
};

// Login page route
router.get("/login", noCache, (req, res) => {
  console.log(req.session, "login");
  if (req.session.user) {
    res.redirect("/route/thanks");
  } else {
    // console.log(`testing`);
    res.render("login", { userLogo: "public/user_logo.png", msg: null });
  }
});

//login user
router.post("/login", noCache, (req, res) => {
  let user = users.find(
    (user) =>
      user.email === req.body.email && user.password === req.body.password
  );
  if (user) {
    // console.log(`testing`);
    req.session.user = req.body.email;
    res.redirect("/route/thanks");
  } else {
    res.render("login", { msg: "invalid username or password!!!" });
  }
});

//thanks route
router.get("/thanks", noCache, (req, res) => {
  const email = req.session.user;
  // console.log("ukyikygi", req.session);

  res.render("thanks", { email });
});

// Home page route
router.get("/home", noCache, (req, res) => {
  // console.log(req.session);
  if (req.session.user) {
    res.render("home");
  } else {
    res.redirect("login");
  }
});

//dashboard route
// router.get("/dashboard", (req, res) => {
//   if (req.session.user) {
//     res.render("dashboard", { user: req.session.user });
//   } else {
//     res.redirect("/");
//   }
// });

// Logout route
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      // Handle error if needed
    }
    res.clearCookie("connect.sid"); // Clear session cookie
    res.redirect("/route/login"); // Redirect to login page
  });
});

module.exports = router;
