import { PROXY } from "./config";
import { toast } from 'react-toastify';

async function skyLogin() {
    try {
        const response = await fetch(`${PROXY}/sky/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const output = await response.json();

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return output;
    } catch (error) {
        toast.error(error.toString());
    }
}

async function skyLogout(token, userID) {
    try {
        const response = await fetch(`${PROXY}/sky/logout`, {
            method: "POST",
            body: JSON.stringify({ "token": token, "userID": userID }),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response;
    } catch (error) {
        toast.error(error.toString());
    }

}

async function isStudent(token, email){
    try{
        const response = await fetch(`${PROXY}/sky/isStudent`, {
            method: "POST",
            body: JSON.stringify({ "token": token, "email": email }),
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const output = await response.json();        
    
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return output;
    }catch(error){
        toast.error(error.toString());
    }
}

export { skyLogin, isStudent, skyLogout };