const express = require('express');
const app = express();

var port = process.env.PORT || 5000;

app.get('/',(req,res) => res.send('Hello World'));

app.listen (port, () => console.log("Listening on port " + port));