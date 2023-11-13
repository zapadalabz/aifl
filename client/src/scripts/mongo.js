import { PROXY } from "./config";

// get all users /users

async function getUsers(){
    const response = await fetch(`${PROXY}/users`)
    const output = await response.json();
    
    return output;
}


// get user by ID aka check if user already has a mongo profile   /users/get/:ID
async function getUserByEmail(email){
    const response = await fetch(`${PROXY}/users/get/${email}`)

    const output = await response.json();
    
    if (output != null){
        return output;
    }
    else{
        return false;
    }
}

//Create or Update a User    /users/update

/* userObject //BrightSpace API whomai: {"Identifier":"1163","FirstName":"Zach","LastName":"Medendorp","Pronouns":null,"UniqueName":"zmedendorp@branksome.on.ca","ProfileIdentifier":"FhoF5s161j"}
    ID:
    firstName:
    lastName:
    email:
    roleID:
    favPrompts: [...promptIDs]
*/

async function upsertUser(userObject){

    const response = await fetch(`${PROXY}/users/upsert`, {
        method: "POST",
        body: JSON.stringify(
            {"userObject": userObject, 
        }),
        headers: {
        'Content-Type': 'application/json'
        },
    });
    return response;
}

/*
Prompt Object
  _id:
  prompt:
  authorID:
  public: true/false
  numFavs:
  tags: []
  dateCreated:
  lastEditDate:
*/

//get all prompts /prompts
async function getPrompts(){
    //returns all prompts
    const response = await fetch(`${PROXY}/prompts`)
    const output = await response.json();
    
    return output;
}

//get prompts by ID(array) used to get user favPrompts    /prompts/get/:IDs
async function getUserFavourites(favIDs){
    //gets previously favourited prompts
    let IDs = encodeURIComponent(JSON.stringify(favIDs));
    const response = await fetch(`${PROXY}/prompts/get/${IDs}`)
    const output = await response.json();
    
    return output;
}

//search prompts, returns a list of prompts that contain a partial match to tag,
async function searchPromptsByTag(tag){

    const response = await fetch(`${PROXY}/prompts/search/${tag}`)
    const output = await response.json();
    console.log(output);
    return output;
}

//Add new Prompt /prompts/add
async function addPrompt(promptObject){
    delete promptObject._id;
    //post new promptObject
    const response = await fetch(`${PROXY}/prompts/add`, {
        method: "POST",
        body: JSON.stringify({promptObject: promptObject}),
        headers: {
        'Content-Type': 'application/json'
        },
    });

    return response;

}

//Update existing prompt with promptID(_id) /prompts/update
async function updatePrompt(promptObject){

    //updates existing prompt
    const response = await fetch(`${PROXY}/prompts/update`, {
        method: "POST",
        body: JSON.stringify(
            {promptObject: promptObject,
        }),
        headers: {
        'Content-Type': 'application/json'
        },
    });

    return response;
}

//Update existing prompt with promptID(_id) /prompts/update
async function deletePrompt(promptID){

    const response = await fetch(`${PROXY}/prompts/delete/${promptID}`)
    const output = await response.json();
    
    return output;
}

export {getUsers, getUserByEmail, upsertUser, getPrompts, getUserFavourites, searchPromptsByTag, addPrompt, updatePrompt, deletePrompt};