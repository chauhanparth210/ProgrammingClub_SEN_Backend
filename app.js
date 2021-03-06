const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
// const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 5000;

const auth = require("./route/auth");
const post = require("./route/post");
const contest = require("./route/contest");
const qna = require("./route/qna");

const Contest = require("./models/Contest");

app.use(helmet()); // Sanitization of requests
app.use(express.json()); // Parsing requests as in JSON format
app.use(cors()); //Use CORS

// Connect to database
mongoose.connect(process.env.DATABASE_STRING_ONLINE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});

const conn = mongoose.connection;
conn.on("error", console.error.bind(console, "MongoDB Error: "));
conn.on("connected", () => {
  console.log("Connected To Database...");
  io.on("connection", (socket) => {
    sendStatus = (s) => {
      socket.emit("status", s);
    };

    Contest.find().then((contests) => {
      socket.emit("output", contests);
    });

    socket.on("addcomment", async (data) => {
      // console.log(data,"contest data")
      const cid = data.contest._id;
      const contest = await Contest.findByIdAndUpdate(cid, data.contest, {
        new: true,
      });
      io.emit("newcomment", contest);
    });
  });
});

//routes
app.use("/auth", auth);
app.use("/post", post);
app.use("/contest", contest);
app.use("/question", qna);

// 404
app.use(function (req, res, next) {
  return res.status(404).send({ message: "Route" + req.url + " Not found." });
});

// 500 - Any server error
app.use(function (err, req, res, next) {
  return res.status(500).send({ error: err });
});

// Start Server
// app.listen(port, () => console.log("Server running on port", port, "..."));
server.listen(port, () => console.log("Server running on port", port, "..."));
