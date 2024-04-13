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
        return data;
    } catch (error) {
        toast.error(error.toString());
    }
}

export {managebacLogin};