const express = require('express');
const path = require('path');

const app = express();
// Serve the React static files after build
app.use(express.static("./client/build"));

var port = process.env.PORT || 5000;

app.listen (port, () => console.log("Listening on port " + port));

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });

app.get("/api/hello", (req, res) => {
    res.send({ message: "Hello" });
  });