import React, {useState, useContext, useEffect} from "react";
import Modal from "../Modal/Modal";
import { Container, Row, Col } from 'react-bootstrap';

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function SaveModal({showSaveModal, handleSave, handleSaveClose, currentFilename=""}){
    const [filename, setFilename] = useState(currentFilename);
    return(
        <Modal show={showSaveModal} handleClose={handleSaveClose}>
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
                        <Button variant="primary" onClick={()=>handleSave(filename)}>Save</Button>
                    </Col>
                    
                </Row>
            </Container>
        </Modal>
    )
}