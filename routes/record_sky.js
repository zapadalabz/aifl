const express = require("express");
require("dotenv").config();
const recordSKYRoutes = express.Router();

recordSKYRoutes.route("/sky/login").post(async function (req, response) {
    //console.log("sky login");
    var url = "https://branksome.myschoolapp.com/api/authentication/login";

    var body = {
        "username": process.env.SKY_APIKEY,//req.body.username,
        "password": process.env.SKY_SECRET,//req.body.password,
    };
    
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'User-Agent': 'PostmanRuntime/7.26.8',
                'Connection': 'keep-alive',
                'Accept-Encoding': 'gzip, deflate, br',
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

recordSKYRoutes.route("/sky/logout").post(async function (req, response) {
    //console.log("sky logout");
    const token = req.body.token;
    const userID = req.body.userID;

    var url = `https://branksome.myschoolapp.com/api/authentication/logout/?t=${token}&format=json`;

    var body = {
        "Token": token,//req.body.username,
        "UserId": userID,//req.body.password,
    };
    
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'User-Agent': 'PostmanRuntime/7.26.8',
                'Connection': 'keep-alive',
                'Accept-Encoding': 'gzip, deflate, br',
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

recordSKYRoutes.route("/sky/isStudent").post(async function (req, response) {
    //get classes currently taught by user
    var token = req.body.token;
    var email = req.body.email;
    var url = `https://branksome.myschoolapp.com/api/user/all?t=${token}&roleIds=27984&email=${email}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'User-Agent': 'PostmanRuntime/7.26.8',
                'Connection': 'keep-alive',
                'Accept-Encoding': 'gzip, deflate, br',
            },
        });
        //console.log(data);
        if (res.json().length > 0) {
            response.send(true);//Student
        }else{
            response.send(false);//Not Student
        }
    } catch (error) {
        // Handle any errors here
        console.error(error);
        response.status(500).send("Error Checking if Student");
    }
});

module.exports = recordSKYRoutes;