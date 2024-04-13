const express = require("express");
require("dotenv").config();
const recordSKYRoutes = express.Router();

recordSKYRoutes.route("/sky/login").post(async function (req, response) {
    console.log("sky login");
    var url = "https://branksome.myschoolapp.com/api/authentication/login";

    var body = {
        "username": process.env.SKY_APIKEY,//req.body.username,
        "password": process.env.SKY_SECRET,//req.body.password,
    };
    
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        // Handle the response here
        //console.log(data.teachers[0].id); // Example: Log the response data
        response.send(data); // return the ID as JSON
    } catch (error) {
        // Handle any errors here
        console.error(error);
        response.status(500).send("SKY ERROR");
    }
});

module.exports = recordSKYRoutes;