import React, { useState} from "react"
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";

import { getUserByEmail, upsertUser } from "../scripts/mongo";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Signin({setUser}){
    const [allowed, setAllowed] = useState(true);

    return(
        <Container>
            <Row className="pt-5">
                <Col className="mx-auto"><h2><span style={{color: "red"}}>A</span>I <span style={{color: "red"}}>F</span>or <span style={{color: "red"}}>L</span>earning</h2></Col>
            </Row>
            <Row className="pt-3">
                <Col className="d-flex justify-content-center align-items-center">
                    <br/>
                    {allowed?
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                        let tempUser = jwt_decode(credentialResponse.credential);
                        console.log(tempUser.hd === "branksome.on.ca");
                        if(tempUser.hd === "branksome.on.ca")  {
                            getUserByEmail(tempUser.email).then( (resp) => {
                                console.log(resp);
                                if(resp.firstName){
                                    setUser(resp);                        
                                    localStorage.setItem('userCredential',credentialResponse.credential);
                                }
                                else{
                                    const newUser = {
                                        firstName: tempUser.given_name,
                                        lastName: tempUser.family_name,
                                        email: tempUser.email,
                                        favPrompts: [],
                                        picture: tempUser.picture,
                                        managebacID: null,
                                    };
                                    upsertUser(newUser).then(()=>{
                                            setUser(newUser);
                                            localStorage.setItem('userCredential',credentialResponse.credential);
                                        });                                
                                }
                            });

                        }else{
                            setAllowed(false);
                        }                              
                        
                        }}
                        onError={() => {
                        console.log('Login Failed');
                        }}
                        auto_select
                        use_fedcm_for_prompt={true}
                    />
                    :
                    <>
                        Access Denied: Branksome Hall only
                    </>
                    }
                </Col>
            </Row>            
        </Container>
    )
}