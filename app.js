const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 5000 || process.env.PORT;

const auth = require("./route/auth");
const post = require("./route/post");
const contest = require("./route/contest");

app.use(morgan("dev")); // logging request
app.use(helmet()); // Sanitization of requests
app.use(express.json()); // Parsing requests as in JSON format
app.use(cors()); //Use CORS

// Connect to database
mongoose.connect(process.env.DATABASE_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("debug", true);
const conn = mongoose.connection;
conn.on("error", console.error.bind(console, "MongoDB Error: "));
conn.on("connected", () => {
  console.log("Connected To Database...");
});

//routes
app.use("/auth", auth);
app.use("/post", post);
app.use("/contest", contest);

// 404
app.use(function (req, res, next) {
  return res.status(404).send({ message: "Route" + req.url + " Not found." });
});

// 500 - Any server error
app.use(function (err, req, res, next) {
  return res.status(500).send({ error: err });
});

// Start Server
app.listen(port, () => console.log("Server running on port", port, "..."));
