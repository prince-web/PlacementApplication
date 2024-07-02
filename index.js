require("dotenv").config();
// Import the express module
const express = require("express");
const port = 5001;
// Create an express app
const app = express();
const cors = require("cors");

const db = require("./src/config/mongoose");

const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./src/config/passport-local-strategy");
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");
const flashmiddleware = require("./src/config/flashmiddleware");
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// use the ejs template
app.set("view engine", "ejs");
app.set("views", "./src/view");

// mongo store is used to store the session cookie in DB
app.use(
  session({
    name: "PlacementCell",
    secret: process.env.SECRET_KEY, // secret key for encryption of cookies, change it everytime you deploy your application on a server
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create(
      {
        mongoUrl: process.env.DB_CONNECT + "/db",
        autoRemove: "disabled",
        mongooseConnection: db,
        collectionName: "sessions",
      },
      function (error) {
        console.log(error || "connect mongodb setup is ok");
      }
    ),
  })
);

// for Authentication
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//require for flash message
app.use(flash());
app.use(flashmiddleware.setFlash);

// use for express router
app.use("/", require("./src/routes"));

// Start the server
app.listen(port, function (error) {
  if (error) {
    console.log(`Error in connecting with server: ${error}`);
  }
  console.log(`Successfully connecting with server ${port}`);
});
