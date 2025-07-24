// Import required modules
const express = require("express");
const session = require("express-session");
const noCache = require("nocache");
const path = require("path");
const app = express();
const dotenv = require("dotenv");

// Load variables from .env
dotenv.config();

// fallback to 3000 if PORT is not set
const PORT = process.env.PORT || 3000;

/* 
  Set static folder for public files 
  and configure Handlebars as the view engine
*/
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "hbs");

/* 
  Middleware setup:
  - Parse JSON and URL-encoded form data
  - Disable client-side caching
  - Set up session with 1-hour expiry
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(noCache());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 hour
  })
);

/* Dummy values for login */
const email = "sreelalpv1234@gmail.com";
const password = "password";

/* 
  GET /
  - If user is logged in, redirect to /home
*/
app.get("/", (req, res) => {
  if (req.session.email) {
    res.redirect("/home");
  } else {
    res.render("login");
  }
});

/* 
  POST /verify
  - Check submitted login value
  - If valid, store email in session and redirect to /home
  - If invalid, re-render login with error message
*/
app.post("/verify", (req, res) => {
  const { email: bodyEmail, password: bodyPassword } = req.body;

  if (bodyEmail === email && bodyPassword === password) {
    req.session.email = bodyEmail;
    res.redirect("/home");
  } else {
    res.render("login", { msg: "Invalid email or password" });
  }
});

/* 
  - Only accessible if logged in
  - Render home page with user email
*/
app.get("/home", (req, res) => {
  if (!req.session.email) return res.redirect("/");
  res.render("home", { email: req.session.email });
});

/* 
  - Destroy user session
  - Redirect to login page
*/
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
});

/* Start the server */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
