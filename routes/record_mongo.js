const express = require("express");
const jwt = require('jsonwebtoken');

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

//BrightSpace API whomai: {"Identifier":"1163","FirstName":"Zach","LastName":"Medendorp","Pronouns":null,"UniqueName":"zmedendorp@branksome.on.ca","ProfileIdentifier":"FhoF5s161j"}
//GET /d2l/api/lp/(version)/enrollments/myenrollments/(orgUnitId)


/*
User
  ID:
  firstName:
  lastName:
  email:
  roleID:
  favPrompts: [...promptIDs]
  managebacID: 
*/

// This section will help you get a list of all the User records.
recordRoutes.route("/users").get(async (req, response) => {
    const db_connect = dbo.getDb();

    db_connect
      .collection("Users") 
      .find({})
      .toArray()
      .then((data) => {
        //console.log(data);
        response.json(data);
      });
  
  });

// Get user by Brightspace ID(Identifier) also can Check if User Exists(ie. needs to make an account)
recordRoutes.route("/users/get/:email").get(async (req, response) => {
  const db_connect = dbo.getDb();
  const myquery = { email: req.params.email };

  try {
      const user = await db_connect.collection("Users").findOne(myquery);

      let role = null;
      let data = user;

      if (!user) {
          // If user is not found, upsert (insert the user)
          const newUser = {
              email: req.params.email,
              role: null // You can set default role or other fields if needed
          };
          const result = await db_connect.collection("Users").updateOne(
              myquery,
              { $setOnInsert: newUser },
              { upsert: true }
          );

          // Fetch the newly inserted user
          data = await db_connect.collection("Users").findOne(myquery);
      } else {
          role = user.role || null;
      }

      const token = jwt.sign({ email: req.params.email, role: role }, process.env.JWT_SECRET, { expiresIn: '240h' });
      response.json({ ...data, token: token });
  } catch (error) {
      console.log(error);
      response.status(500).send("Internal Server Error");
  }
});

//Create or Update a User
recordRoutes.route("/users/upsert").post(async function (req, response) {
    let db_connect = dbo.getDb();
    //requiresm req.body.ID for query, and req.body.userObject with fields to be upserted
    let myquery = {email: req.body.userObject.email}; //users have an ID from Brightspace called Identifier

    delete req.body.userObject._id;
    delete req.body.userObject.token;
    /* userObject Google Login
      firstName:
      lastName:
      email:
      favPrompts: [...promptIDs]
      picture:
      managebacID:
    */

    let myobj = {$set: req.body.userObject};

    let options = {upsert : true};

    let result = await db_connect.collection("Users").updateOne(myquery, myobj, options);
    response.send(result).status(204);
});

///PROMPTS///

/*
Prompts
  promptID:
  prompt:
  authorID:
  public: true/false
  numFavs:
  tags: []
  dateCreated:
  lastEditDate:
*/

//get all prompts
recordRoutes.route("/prompts").get(async function (req, response) {
  let db_connect = dbo.getDb();

  db_connect
    .collection("Prompts") 
    .find({})
    .toArray()
    .then((data) => {
      //console.log(data);
      response.json(data);
    });

});

//get prompts by ID(array) used to get user favPrompts
recordRoutes.route("/prompts/get/:IDs").get(async function (req, response) {
  let db_connect = dbo.getDb();
  //IDs are sent as encodeURIComponent(JSON.stringify(IDs)), which are an array
  let promptIDs = JSON.parse(req.params.IDs);
  let myquery = { _id: {$in: promptIDs.map(id=>new ObjectId(id))} };
  db_connect
    .collection("Prompts") 
    .find(myquery)
    .toArray() // Convert the cursor to an array
    .then((data) => {
      response.json(data);
    })
    .catch((error) => {
      console.error(error);
      response.status(500).json({ error: 'Internal Server Error' });
    });

});

recordRoutes.route("/prompts/search/:tag").get(async function (req, response) {
  let db_connect = dbo.getDb();
  let tag = req.params.tag;
  //returns a case-insensitive match to the tag input
  let myquery = { tags: {$elemMatch: {
      $regex: new RegExp(tag, 'i')}
      }
    };
  db_connect
    .collection("Prompts") 
    .find(myquery)
    .toArray() // Convert the cursor to an array
    .then((data) => {
      response.json(data);
    })
    .catch((error) => {
      console.error(error);
      response.status(500).json({ error: 'Internal Server Error' });
    });

});

//Add new Prompt
recordRoutes.route("/prompts/add").post(async function (req, response) {
  let db_connect = dbo.getDb();

  /* 
    _id:         //generated by MongoDB _id : ObjectID('...')
    prompt:
    authorID: 
    public: true/false
    numFavs:
    tags: []
    dateCreated:
    lastEditDate:
  */

  let myobj = req.body.promptObject;

  let result = await db_connect.collection("Prompts").insertOne(myobj);
  response.setHeader('Content-Type', 'application/json');
  response.status(204).send(JSON.stringify({ insertedId: result.insertedId }));
}); 

//Update a Prompt
recordRoutes.route("/prompts/update").post(async function (req, response) {
  let db_connect = dbo.getDb();
  //requires req.body.promptID, and req.body.promptObject which contains the fields to be updated
  let myquery = {"_id": new ObjectId(req.body.promptObject._id)}; //generated by MongoDB _id : ObjectID('...')

  /* 
    _id: promptID
    prompt:
    authorID:
    public: true/false
    numFavs:
    tags: []
    dateCreated:
    lastEditDate:
  */
  delete req.body.promptObject._id;
  let myobj = {$set: req.body.promptObject};

  let options = {upsert : false};

  let result = await db_connect.collection("Prompts").updateOne(myquery, myobj, options);
  response.send(result).status(204);
});

recordRoutes.route("/prompts/delete/:ID").get(async function (req, response) {
  let db_connect = dbo.getDb();

  let myquery = { "_id": new ObjectId(req.params.ID)};
  db_connect
    .collection("Prompts") 
    .deleteOne(myquery)
    .then((data) => {
      //console.log(data);
      response.json(data);
    });

});


//courses API


recordRoutes.route("/courses/update").post(async function (req, response) {
  let db_connect = dbo.getDb();
  //updates a course based on the teacher, reporting period, and course code
  let myquery = {$and: [
    { "email": req.body.courseObj.email },
    { "reporting_period": req.body.courseObj.reporting_period },
    { "course_code": req.body.courseObj.course_code }
  ]};
  
  /*
      courseObj = {
                _id: //generated by MongoDB _id : ObjectID('...')
                "class_id": class_id,
                "reporting_period": reporting_period,
                "email": email,
                "course_code": item.code,
                "studentList": [ {id: , first_name: last_name: nickname: overall: [] comment: "", ATL:[], MYP:[], locked: boolean } ]
                "program_code": program_code,
            }
  */
  delete req.body.courseObj._id;
  let myobj = {$set: req.body.courseObj};

  let options = {upsert : true};

  let result = await db_connect.collection("Courses").updateOne(myquery, myobj, options);
  response.send(result).status(204);
});

// Get commentObj by matching the same myquery within the database
recordRoutes.route("/courses/get").post(async function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = {$and: [
    { "email": req.body.email },
    { "reporting_period.id": req.body.reporting_period.id },
    { "course_code": req.body.course_code }
  ]};

  let courseObj = await db_connect.collection("Courses").findOne(myquery);
  response.json(courseObj);
});

//CommentBank

recordRoutes.route("/commentbank/get/:email").get(async function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { email: req.params.email };
  
  db_connect
      .collection("CommentBank") 
      .find(myquery)
      .toArray()
      .then((data) => {
        //console.log(data);
        response.json(data);
      });
});

recordRoutes.route("/commentbank/update").post(async function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = {$and: [
    { "email": req.body.commentObj.email },
    { "filename": req.body.commentObj.filename }
  ]};

  /*
    commentObj = {
      email:
      filename:
      comments: [{title, desc, comments}, ...]
  */

  let options = {upsert : true};
  delete req.body.commentObj._id;
  let myobj = {$set: req.body.commentObj};

  let courseObj = await db_connect.collection("CommentBank").updateOne(myquery, myobj, options);

  response.json(courseObj);
});

//BLACK-BAUD USER
recordRoutes.route("/BB/users/getByID/:userID").get(async (req, response) => {
  //console.log(req.params.userID);
  const db_connect = dbo.getDb();
  const myquery = { userID: Number.parseInt(req.params.userID) };

  try {
      const user = await db_connect.collection("BB_Users").findOne(myquery);
      let data = user;

      if (!user) {
          // If user is not found, upsert (insert the user)
          const newUser = {
            userID: Number.parseInt(req.params.userID),
            acc_creation_date: new Date().toISOString(),
          };
          const result = await db_connect.collection("BB_Users").updateOne(
              myquery,
              { $setOnInsert: newUser },
              { upsert: true }
          );

          // Fetch the newly inserted user
          data = await db_connect.collection("BB_Users").findOne(myquery);
      }

      const token = jwt.sign({ email: req.params.userID, role: null }, process.env.JWT_SECRET, { expiresIn: '240h' });
      response.json({ ...data, token: token });
  } catch (error) {
      console.log(error);
      response.status(500).send("Internal Server Error");
  }
});


recordRoutes.route("/BB/updateUser").post(async (req, response) => {
  const db_connect = dbo.getDb();
  const userObj = req.body.userObj;
  const myquery = { userID: userObj.userID };
  const options = { upsert: true };

  // Remove the _id field if it exists, as it should not be updated
  delete userObj._id;

  try {
      const user_response = await db_connect.collection("BB_Users").updateOne(
          myquery,
          { $set: userObj }, // Use $set to update the fields in userObj
          options
      );
      response.json(user_response);
  } catch (error) {
      console.error("Error occurred:", error);
      response.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = recordRoutes;