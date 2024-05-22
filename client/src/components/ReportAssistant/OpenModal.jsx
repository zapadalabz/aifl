import React, {useState, useContext, useEffect} from "react";
import Modal from "../Modal/Modal";
import { Container, Row, Col } from 'react-bootstrap';

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function OpenModal({showOpenModal, handleOpen, handleOpenClose, userCommentBank}){
    const [fileIndex, setFileIndex] = useState(0);
    //console.log(userCommentBank);
    return(
        <Modal show={showOpenModal} handleClose={handleOpenClose}>
            <Container>
                <Row>
                    <Col xs={4}>
                        <InputGroup className="mb-1">
                            <InputGroup.Text id="filename">Filename</InputGroup.Text>
                            <Form.Control
                                as="select"
                                id="filename-input"
                                aria-describedby="filename"
                                placeholder="Enter filename"
                                maxLength={28}
                                value={userCommentBank[fileIndex].filename}
                                onChange={(e) => setFileIndex(e.target.value)}
                            >
                                {userCommentBank.map((item, index) => (
                                    <option key={item._id} value={index}>{item.filename}</option>
                                ))}
                            </Form.Control>
                            

                        </InputGroup>
                        
                    </Col>
                    <Col xs={4}>
                        <Button variant="primary" onClick={()=>handleOpen(fileIndex)}>Open</Button>
                    </Col>
                    
                </Row>
            </Container>
        </Modal>
    )
}