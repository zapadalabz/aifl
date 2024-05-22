import { PROXY, FLASK_PROXY } from './config';
import { toast } from 'react-toastify';

async function managebacLogin(username, password){
    try {
        const response = await fetch(`${PROXY}/playwright/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        //console.log(response.ok);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${data.error}`);
        }
        return data;
    } catch (error) {
        toast.error(error.toString());
        return [];
    }
}

async function getClass(email, classID){
    try {
        const response = await fetch(`${PROXY}/playwright/getClass/${email}/${classID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        toast.error(error.toString());
    }
}

async function updateStudent(email, studentUpdate){
    try {
        const response = await fetch(`${PROXY}/playwright/updateStudentCard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, studentObj: studentUpdate })
        });
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        toast.error(error.toString());
    }
}

async function updateStudentList(email, studentUpdate){
    try {
        const response = await fetch(`${PROXY}/playwright/updateStudentCardList`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, studentObj: studentUpdate })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        toast.error(error.toString());
    }
}

export {managebacLogin, getClass, updateStudent, updateStudentList};