import React, {useState, useContext, useEffect} from "react";
import Modal from "../Modal/Modal";
import { Container, Row, Col } from 'react-bootstrap';

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function PasswordModal({setLoggedIn, showModal, handlePasswordClose}){
    const [password, setPassword] = useState("");

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          handlePasswordClose(password);
        }
      };

    return(
        <Modal show={showModal} handleClose={handlePasswordClose}>
            <Container>
                <Row>
                    <Col xs={4}>
                        <InputGroup className="mb-1" onKeyDown={handleKeyDown}>
                            <InputGroup.Text id="password">Managebac Password</InputGroup.Text>
                            <Form.Control
                                type="password"
                                id="password-input"
                                aria-describedby="password"
                                placeholder="Managebac Password"
                                maxLength={28}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </InputGroup>
                        
                    </Col>
                    <Col xs={4}>
                        <Button variant="primary" onClick={()=>handlePasswordClose(password)}>Login</Button>
                    </Col>
                    
                </Row>
            </Container>
        </Modal>
    )
}