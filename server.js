const express = require('express');
const path = require('path');
require("dotenv").config();

const app = express();
const cors = require('cors');

// Serve the React static files after build
app.use(express.static("./client/build"));

var port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));
app.use(require("./routes/record_openAI"));

const dbo = require("./db/conn");

app.listen (port, async () => {
  console.log("Listening on port " + port);
  await dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
});

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });

app.get("/api/hello", (req, res) => {
    res.send({ message: "Hello" });
  });