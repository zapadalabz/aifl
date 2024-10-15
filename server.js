const express = require('express');
const path = require('node:path');
require("dotenv").config();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const cors = require('cors');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve the React static files after build
app.use(express.static("./client/build"));

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(require("./routes/record_mongo"));
app.use(require("./routes/record_managebac"));
app.use(require("./routes/record_blackbaud"));


const dbo = require("./db/conn");

app.listen (port, async () => {
  console.log(`Listening on port ${port}`);
  await dbo.connectToServer((err) => {
    if (err) console.error(err);
  });
});


app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (token == null) {
      return res.sendStatus(401); // if there isn't any token
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
          return res.status(403).send('Session expired. Please refresh the page.');
      }

      req.user = user;
      next(); // pass the execution off to whatever request the client intended
  });
}

const requests = {};

function limitRate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  //console.log(token);

  if (token == null) {
    return res.sendStatus(401).send("No token provided.");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    //console.log(user);
    if (err) {
      return res.sendStatus(403).send('Session expired. Please refresh the page.');
    }
    const limit = 30;
    //if (user.role === "Staff") limit = 30;
    if (!requests[user.email]) {
      requests[user.email] = { count: 1, firstRequest: Date.now() };
    } else {
      requests[user.email].count += 1;
      // Assuming limit is 100 requests per 15 minutes
      if (requests[user.email].count > limit && Date.now() - requests[user.email].firstRequest < 15 * 60 * 1000) {
        const timeLeft = (15 * 60 * 1000 - (Date.now() - requests[user.email].firstRequest)) / 1000;
        return res.status(429).send(`Too many requests: ${limit} per 15 minutes. Please try again in ${timeLeft} seconds.`);
      } else if (Date.now() - requests[user.email].firstRequest >= 15 * 60 * 1000) {
        // Reset count after 15 minutes
        requests[user.email] = { count: 1, firstRequest: Date.now() };
      }
    }

    next();
  });
}

app.use(limitRate);


//app.use(authenticateToken);
app.use(require("./routes/record_openAI"));