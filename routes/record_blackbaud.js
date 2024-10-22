const express = require("express");
require("dotenv").config();
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch'); // Make sure to install node-fetch if you haven't already
const recordBlackBaudRoutes = express.Router();
const secret_key = process.env.BB_SECRET_KEY;
const issuer_domain = process.env.ISSUER_DOMAIN;
const token_name = process.env.TOKEN_NAME;
const audience_domain = process.env.AUDIENCE_DOMAIN;
const sso_path = process.env.SSO_PATH;

const DEV = process.env.DEV === 'true' || false;

const BB_userID = 5623163;

recordBlackBaudRoutes.route("/blackbaud-sso").get(async (req, res) => {
    try {
        const ssoToken = req.query[token_name];
        if (!ssoToken) {
            throw new Error('Token not provided');
        }
        const token = jwt.verify(ssoToken, secret_key, {
            issuer: issuer_domain,
            audience: audience_domain
        });
        //console.log(token);
        const keys = require('node:crypto').createHash('sha512').update(secret_key + ssoToken).digest('hex');
        const uri = token.post_url;
        const postData = {
            key: keys,
            jwt: ssoToken
        };
        try {
            const response = await fetch(uri, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Blackbaud SSO/ 1.0'
                },
                body: JSON.stringify(postData)
            });
            const responseData = await response.json();
            //console.log(responseData);
            //console.log(DEV);
            // Redirect to a React route with any necessary query parameters
            res.redirect(`${DEV ? "http://localhost:3000" : "https://aifl.azurewebsites.net"}/BB?sso_token=${ssoToken}`);
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(JSON.stringify(error));
    }
});

recordBlackBaudRoutes.route("/blackbaud-sso/status/:token").get(async (req, res) => {
    const ssoToken = req.params.token;
    try {
        if (!ssoToken) {
            throw new Error('Token not provided');
        }
        const token = jwt.verify(ssoToken, secret_key, {
            issuer: issuer_domain,
            audience: audience_domain
        });
        //console.log(token);
        res.status(200).send(JSON.stringify(token));
    } catch (error) {
        console.error(error);
        res.status(500).send(JSON.stringify(error));
    }

});

recordBlackBaudRoutes.route("/blackbaud-api/getUser/").post(async (req, res) => {
    const userId = req.body.userId;
    const token = req.body.ssoToken;
    try {
        if (!userId) {
            throw new Error('UserID not provided');
        }
        //const token = '1d90c8ce-f79a-43aa-87dc-16d62bd1b971';//'aaf2a85c-b9a1-710f-650a-b8c58be074e3'
        const uri = `${issuer_domain}/api/user/${userId}?t=${token}`;
        const response = await fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Blackbaud SSO/ 1.0'
            }
        });
        const responseData = await response.json();
        //console.log(responseData);
        res.status(200).send(JSON.stringify(responseData));
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }

});

recordBlackBaudRoutes.get('/BB/login', async (req, res) => {
    const SKY_KEY = process.env.SKY_APIKEY;
    const SKY_SECRET = process.env.SKY_SECRET;
    const url = "https://branksome.myschoolapp.com/api/authentication/login";
    const headers = {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'User-Agent': 'PostmanRuntime/7.26.8',
        'Connection': 'keep-alive',
        'Accept-Encoding': 'gzip, deflate, br',
    };
    const data = JSON.stringify({
        "username": SKY_KEY,
        "password": SKY_SECRET,
    });
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: data
        });
        const responseData = await response.json();
        //console.log(response.status);
        //console.log(responseData);
        res.status(response.status).send(responseData);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

recordBlackBaudRoutes.post('/BB/logout', async (req, res) => {
    const { token } = req.body;
    const url = `https://branksome.myschoolapp.com/api/authentication/logout/?t=${token}&format=json`;
    const headers = {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'User-Agent': 'PostmanRuntime/7.26.8',
        'Connection': 'keep-alive',
        'Accept-Encoding': 'gzip, deflate, br',
    };
    const data = JSON.stringify({
        "Token": token,
        "UserId": BB_userID,
    });
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: data
        });
        const responseData = await response.json();
        //console.log(response.status);
        //console.log(responseData);
        res.status(response.status).send(responseData);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

recordBlackBaudRoutes.post('/BB/getTeacherSections', async (req, res) => {
    const { token, userID, schoolYear } = req.body;
    const url = `https://branksome.myschoolapp.com/api/academics/TeacherSection?t=${token}&schoolYear=${schoolYear}&userID=${userID}&format=json`;
    const headers = {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'User-Agent': 'PostmanRuntime/7.26.8',
        'Connection': 'keep-alive',
        'Accept-Encoding': 'gzip, deflate, br',
    };
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });
        const responseData = await response.json();
        //console.log(responseData);
        res.status(response.status).send(responseData);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

module.exports = recordBlackBaudRoutes;