const express = require("express");
const app = express();

require("dotenv").config();
const cors = require("cors");
const jwt = require("jsonwebtoken");

const db = require("./mongo");
const userRoutes = require("./user_routes");
const service = require("./modules/reset_service");

const Port = process.env.PORT || 9999;

async function connect() {
//connecting to database
  await db.connect();

  app.use(express.json());
  app.use(cors());

//user route for register login
  app.use("/user", userRoutes);

//get all urls

  app.get("/allurls", async (req, res) => {
    const all = await db.url.find().toArray();
    res.send(all);
  });

//route for reset the password
  app.post("/reset", service.resets);

//Route for setting new password
  app.post("/new_password", service.newpassword);

//middleware calling with the provided login token
  app.use((req, res, next) => {
    const token = req.headers["auth-token"];
    if (token) {
        req.user = jwt.verify(token, "admin123");
        console.log(req.user);
        next();
  } 
  else {res.sendStatus(401); }

  });

//route for generating a new url
  app.post("/create_url", service.createUrl);

//route for redirecting from short url to long url
  app.get("/redirection/:id", service.redirection);

  app.listen(Port, () => {
    console.log(`Server is stated on http://localhost:${Port}`);
  });
}

connect();
