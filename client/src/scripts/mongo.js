import { PROXY } from "./config";
import { toast } from 'react-toastify';

async function getUsers() {
    try {
        const response = await fetch(`${PROXY}/users`);
        const output = await response.json();

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return output;
    } catch (error) {
        toast.error(error.toString());
    }
}

async function getUserByEmail(email) {
    try {
        const response = await fetch(`${PROXY}/users/get/${email}`);
        const output = await response.json();
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        if (output != null) {
            return output;
        } else {
            return false;
        }
    } catch (error) {
        toast.error(error.toString());
    }
}

async function upsertUser(userObject) {
    try {
        const response = await fetch(`${PROXY}/users/upsert`, {
            method: "POST",
            body: JSON.stringify({ "userObject": userObject }),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(response.json());
        }

        return response;
    } catch (error) {
        toast.error(error.toString());
    }
}

async function getPrompts() {
    try {
        const response = await fetch(`${PROXY}/prompts`);
        const output = await response.json();
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return output;
    } catch (error) {
        toast.error(error.toString());
    }
}

async function getUserFavourites(favIDs) {
    try {
        let IDs = encodeURIComponent(JSON.stringify(favIDs));
        const response = await fetch(`${PROXY}/prompts/get/${IDs}`);
        const output = await response.json();
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return output;
    } catch (error) {
        toast.error(error.toString());
    }
}

async function searchPromptsByTag(tag) {
    try {
        const response = await fetch(`${PROXY}/prompts/search/${tag}`);
        const output = await response.json();
        //console.log(output);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return output;
    } catch (error) {
        toast.error(error.toString());
    }
}

async function addPrompt(promptObject) {
    try {
        delete promptObject._id;
        const response = await fetch(`${PROXY}/prompts/add`, {
            method: "POST",
            body: JSON.stringify({ promptObject: promptObject }),
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!response.ok) {
            throw new Error(response.json());
        }
        return response;
    } catch (error) {
        toast.error(error.toString());
    }
}

//Update existing prompt with promptID(_id) /prompts/update
async function updatePrompt(promptObject){

    //updates existing prompt
    try{
        const response = await fetch(`${PROXY}/prompts/update`, {
            method: "POST",
            body: JSON.stringify(
                {promptObject: promptObject,
            }),
            headers: {
            'Content-Type': 'application/json'
            },
        });
        if (!response.ok) {
            throw new Error(response.json());
        }
        return response;
    } catch (error) {
        toast.error(error.toString());
    }

    
}

//Update existing prompt with promptID(_id) /prompts/update
async function deletePrompt(promptID){

    try{
        const response = await fetch(`${PROXY}/prompts/delete/${promptID}`)
        const output = await response.json();
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return output;
    }catch(error){
        toast.error(error.toString());
    }
    
}


//CommentBank

/*
    commentObj = {
      email:
      filename:
      comments: [{title, desc, comments}, ...]
  */

async function getComments(email){
    try{
        const response = await fetch(`${PROXY}/commentbank/get/${email}`)
        const output = await response.json();
    
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return output;
    }catch(error){
        toast.error(error.toString());
    }
}

async function updateComments(email, filename, commentBank){
    let commentObj = {
        email: email,
        filename: filename,
        comments: commentBank
    }
    //updates existing prompt
    try{
        const response = await fetch(`${PROXY}/commentbank/update`, {
            method: "POST",
            body: JSON.stringify(
                {commentObj: commentObj,
            }),
            headers: {
            'Content-Type': 'application/json'
            },
        });
        if (!response.ok) {
            throw new Error(response.json());
        }
    }catch(error){
        toast.error(error.toString());
    }
    
}

//BLACK BAUD USERS
async function getUserByID(userID) {
    try {
        const response = await fetch(`${PROXY}/BB/users/getByID/${userID}`);
        const output = await response.json();
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        if (output != null) {
            return output;
        }
            return false;
    } catch (error) {
        toast.error(error.toString());
    }
}

async function updateBBUser(userObj){
    //updates existing prompt
    try{
        const response = await fetch(`${PROXY}/BB/updateUser`, {
            method: "POST",
            body: JSON.stringify(
                {userObj: userObj,
            }),
            headers: {
            'Content-Type': 'application/json'
            },
        });
        if (!response.ok) {
            throw new Error(response.json());
        }
    }catch(error){
        toast.error(error.toString());
    }
    
}

export {getUsers, getUserByEmail, upsertUser, getPrompts, getUserFavourites, searchPromptsByTag, addPrompt, updatePrompt, deletePrompt, updateComments, getComments, getUserByID, updateBBUser};