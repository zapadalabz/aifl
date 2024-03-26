import React, {useState, useContext, useEffect} from "react";
import Modal from "../Modal/Modal";
import { Container, Row, Col } from 'react-bootstrap';

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function OpenModal({showOpenModal, handleOpen, handleOpenClose, userCommentBank}){
    const [filename, setFilename] = useState("");
    console.log(userCommentBank);
    return(
        <Modal show={showOpenModal} handleClose={handleOpenClose}>
            <Container>
                <Row>
                    <Col xs={4}>
                        <InputGroup className="mb-1">
                            <InputGroup.Text id="filename">Filename</InputGroup.Text>
                            <Form.Control
                                type="text"
                                id="filename-input"
                                aria-describedby="filename"
                                placeholder="Enter filename"
                                maxLength={28}
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                            />
                        </InputGroup>
                        
                    </Col>
                    <Col xs={4}>
                        <Button variant="primary" onClick={()=>handleOpen(filename)}>Save</Button>
                    </Col>
                    
                </Row>
            </Container>
        </Modal>
    )
}