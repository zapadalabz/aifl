const express = require("express");
require("dotenv").config();
const recordManagebacRoutes = express.Router();

const MANAGEBAC_TOKEN = process.env.MANAGEBAC_TOKEN;

const headers = {
    "auth-token": MANAGEBAC_TOKEN,  // replace this with your actual token
};

recordManagebacRoutes.route("/managebac/getID/:email").get(async (req, response) => {
    //get user ID from managebac using their email
    const email = req.params.email;
    const url = "https://api.managebac.com/v2/teachers";

    const params = {
        "archived": "false",
        "per_page": 10,
        "q": email,
    };
    
    try {
        const searchParams = new URLSearchParams(params);
        const res = await fetch(`${url}?${searchParams}`, { headers });
        const data = await res.json();
        // Handle the response here
        console.log(data.teachers[0].id); // Example: Log the response data
        response.send({id: data.teachers[0].id}); // return the ID as JSON
    } catch (error) {
        // Handle any errors here
        console.error(error);
        response.status(500).send("Internal Server Error");
    }
});

recordManagebacRoutes.route("/managebac/getClasses/:ID").get(async function (req, response) {
    //get classes currently taught by user
    var ID = req.params.ID;
    var url = `https://api.managebac.com/v2/teachers/${ID}/classes`;
    var params = {
        "archived": "false",
        "show_on_reports": "true",
    };
    
    try {
        const searchParams = new URLSearchParams(params);
        const res = await fetch(`${url}?${searchParams}`, { headers });
        const data = await res.json();
        // Handle the response here
        //console.log(data); // Example: Log the response data
        var classes = [];
        for (var i = 0; i < data.classes.length; i++) {
            classes.push({
                "id": data.classes[i].id,
                "name": data.classes[i].name,
                "code": data.classes[i].uniq_id.replace(/\s/g, ""),
            });
        }
        //console.log(data);
        response.send(classes); // Example: Send the response data back to the client
    } catch (error) {
        // Handle any errors here
        console.error(error);
        response.status(500).send("Internal Server Error");
    }
});


recordManagebacRoutes.route("/managebac/getStudent/:ID").get(async function (req, response) {
    //get student data by their ID
    var student_ID = req.params.ID;

    url = `https://api.managebac.com/v2/students/${student_ID}`;
    params = {
        "archived": "false",
    }
    
    try {
        const searchParams = new URLSearchParams(params);
        const res = await fetch(`${url}?${searchParams}`, { headers });
        const data = await res.json();
        // Handle the response here
        //console.log(data); // Example: Log the response data
        var student_info = {
            "id": data.student.id,
            "first_name": data.student.first_name,
            "last_name": data.student.last_name,
            "nickname": data.student.nickname||"",
        }
        response.send(student_info); // Example: Send the response data back to the client
    } catch (error) {
        // Handle any errors here
        console.error(error);
        response.status(500).send("Internal Server Error");
    }
});

recordManagebacRoutes.route("/managebac/getStudentList/:ID").get(async function (req, response) {
    //get students enrolled in the classes listed by their ID
    var class_ID = req.params.ID;

    url = `https://api.managebac.com/v2/classes/${class_ID}/students`;
    var params = {
        "archived": "false",
    };
    
    try {
        const searchParams = new URLSearchParams(params);
        const res = await fetch(`${url}?${searchParams}`, { headers });
        const data = await res.json();
        // Handle the response here
        //console.log(data); // Example: Log the response data
        response.send(data); // Example: Send the response data back to the client
    } catch (error) {
        // Handle any errors here
        console.error(error);
        response.status(500).send("Internal Server Error");
    }
});

recordManagebacRoutes.route("/managebac/getClassProgram/:id").get(async function (req, response) {
    //get program for a class by its ID
    var class_ID = req.params.id;

    url = `https://api.managebac.com/v2/classes/${class_ID}`;
    
    try {
        const res = await fetch(`${url}`, { headers });
        // Handle the response here
        const data = await res.json();
        //console.log(data); // Example: Log the response data
        response.send(data.class); // Example: Send the response data back to the client
    } catch (error) {
        // Handle any errors here
        console.error(error);
        response.status(500).send("Internal Server Error");
    }
});

recordManagebacRoutes.route("/managebac/getSchoolDetails").get(async function (req, response) {
    //get school details

    url = `https://api.managebac.com/v2/school`;
    
    try {
        const res = await fetch(`${url}`, { headers });
        const data = await res.json();
        // Handle the response here
        //console.log(data); // Example: Log the response data
        response.send(data); // Example: Send the response data back to the client
    } catch (error) {
        // Handle any errors here
        console.error(error);
        response.status(500).send("Internal Server Error");
    }
});

recordManagebacRoutes.route("/managebac/getAcademicYears").get(async function (req, response) {
    //get students enrolled in the classes listed by their ID

    url = `https://api.managebac.com/v2/school/academic-years`;
    
    try {
        const res = await fetch(`${url}`, { headers });
        const data = await res.json();
        // Handle the response here
        //console.log(data); // Example: Log the response data
        response.send(data); // Example: Send the response data back to the client
    } catch (error) {
        // Handle any errors here
        console.error(error);
        response.status(500).send("Internal Server Error");
    }
});


recordManagebacRoutes.route("/managebac/getRole/:email").get(async function (req, response) {
    //get user ID from managebac using their email
    var email = req.params.email;
    var url = "https://api.managebac.com/v2/students";

    var params = {
        "archived": "false",
        "per_page": 1,
        "q": email,
    };
    
    try {
        const searchParams = new URLSearchParams(params);
        const res = await fetch(`${url}?${searchParams}`, { headers });
        const data = await res.json();
        // Handle the response here
        //console.log(data); // Example: Log the response data
        if(data.students.length === 0){
            response.send({"role": "Staff"});
        }
        else{
            response.send({"role": data.students[0].role}); // return the role as JSON
        }        
    } catch (error) {
        // Handle any errors here
        console.error(error);
        response.status(500).send("Internal Server Error");
    }
});

module.exports = recordManagebacRoutes;