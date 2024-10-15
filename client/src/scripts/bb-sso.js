import { PROXY } from "./config";
import { toast } from 'react-toastify';

async function getStatus(token) {
    //console.log(token);
    window.addEventListener('message', (event) => {  
        const message = event.data;
        console.log('Received message:', message);
      });
    try {
        const response = await fetch(`${PROXY}/blackbaud-sso/status/${token}`);
        const output = await response.json();

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return output;
    } catch (error) {
        toast.error(error.toString());
    }
}

async function BB_Login() {
    try {
        const response = await fetch(`${PROXY}/BB/login`, {
            method: "GET",
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

async function BB_Logout(token) {
    try {
        const response = await fetch(`${PROXY}/BB/logout`, {
            method: "POST",
            body: JSON.stringify({ "token": token }),
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

async function getBBUser(userId, ssoToken) {
    try {
        const response = await fetch(`${PROXY}/blackbaud-api/getUser`, {
            method: "POST",
            body: JSON.stringify({ "userId": userId, "ssoToken": ssoToken }),
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

async function getTeacherSections(userID, token, schoolYear = '2024 - 2025') {
    try {
        const response = await fetch(`${PROXY}/BB/getTeacherSections`, {
            method: "POST",
            body: JSON.stringify({ "userID": userID, "token": token, "schoolYear": schoolYear }),
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

export { getStatus, getBBUser, BB_Login, BB_Logout, getTeacherSections };