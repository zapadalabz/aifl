import { PROXY } from './config';

export async function login(){

    const response = await fetch(`${PROXY}/login`);
    const user = await response.json();
    //console.log(user);
    return user;
}


export async function getRole(ID){

    const response = await fetch(`${PROXY}/getEnrollment/${ID}`)
    const enrollment = await response.json();
    console.log(enrollment);
    return enrollment;
}