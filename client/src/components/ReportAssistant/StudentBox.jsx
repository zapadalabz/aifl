import React, { useState, useContext } from "react";
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { faLockOpen } from "@fortawesome/free-solid-svg-icons/faLockOpen";
import StudentContext from "./StudentContext";

export default function StudentBox({student, course_id}) {
    const {state, dispatch} = useContext(StudentContext);
    const grade_options = ['','7+', '7', '7-', '6+', '6', '6-', '5+', '5', '5-', '4+', '4', '4-', '3+', '3', '3-', '2+', '2', '2-', '1+', '1', '1-', 'N'].map((option) => { return <option key={option} value={option}>{option}</option>});
    const myp_options = ['','8', '7', '6', '5', '4', '3', '2', '1', 'N'].map((option) => { return <option key={option} value={option}>{option}</option>});
    const atl_options = ['HE', 'E', 'ME', 'IE', 'N'].map((option) => {
        return (
            <option key={option} value={option}>
                {option}
            </option>
        );
    });

    const toggleLock = () => {
        dispatch({
            type: 'UPDATE_STUDENT',//TOGGLE_LOCK
            payload: {
              student_id: student.id,
              course_id: course_id,
              updates: {locked: !student.locked},
            }
          });
    };

    const updateComment = (e) => {
        dispatch({
            type: 'UPDATE_STUDENT',//UPDATE COMMENT
            payload: {
              student_id: student.id,
              course_id: course_id,
              updates: {comment: e.target.value},
            }
          });
    }


    return (
        <Container fluid className="studentBoxContainer">
            <Row className="studentBoxName" >
                {student.first_name} {student.last_name} {student.nickname?"("+student.nickname+")":""}
                <FontAwesomeIcon className="fa-2x float-end" icon={student.locked?faLock:faLockOpen} onClick={toggleLock}/>                
            </Row>
            <Row className="d-flex my-2" >
                <Col xs={3} >
                    <InputGroup className="mb-1">
                        <InputGroup.Text id="overall-grade">Overall</InputGroup.Text>
                        <Form.Select aria-label="Overall" aria-describedby="overall-grade" defaultValue={student.overall||""}>
                            {grade_options}
                        </Form.Select> 
                    </InputGroup>
                </Col>
                <Col xs={2} >
                    <InputGroup className="mb-1">
                        <InputGroup.Text id="ATL1">O</InputGroup.Text>
                        <Form.Select aria-label="Organization" aria-describedby="ATL1" defaultValue={student.ATL[0]||"E"}>
                            {atl_options}
                        </Form.Select> 
                    </InputGroup> 
                </Col>
                <Col xs={2} >
                    <InputGroup className="mb-1">
                        <InputGroup.Text id="ATL2">SR</InputGroup.Text>
                        <Form.Select aria-label="Self-Regulation" aria-describedby="ATL2"  defaultValue={student.ATL[1]||'E'}>
                            {atl_options}
                        </Form.Select> 
                    </InputGroup> 
                </Col>  
                <Col xs={2} >
                    <InputGroup className="mb-1">
                        <InputGroup.Text id="ATL3">C</InputGroup.Text>
                        <Form.Select aria-label="Collaboration" aria-describedby="ATL3"  defaultValue={student.ATL[2]||'E'}>
                            {atl_options}
                        </Form.Select> 
                    </InputGroup> 
                </Col>  
                <Col xs={2} >
                    <InputGroup className="mb-1">
                        <InputGroup.Text id="ATL4">L</InputGroup.Text>
                        <Form.Select aria-label="Leadership" aria-describedby="ATL4"  defaultValue={student.ATL[3]||'E'}>
                            {atl_options}
                        </Form.Select> 
                    </InputGroup> 
                </Col>                       
            </Row>
            {student.program === "myp" &&
            <Row className="d-flex my-2">
                <Col xs={3} />
                <Col xs={2} >
                    <InputGroup className="mb-1">
                        <InputGroup.Text id="MYP1">A</InputGroup.Text>
                        <Form.Select aria-label="A" aria-describedby="MYP1" defaultValue={student.MYP[0]||""}>
                            {myp_options}
                        </Form.Select> 
                    </InputGroup> 
                </Col>
                <Col xs={2} >
                    <InputGroup className="mb-1">
                        <InputGroup.Text id="MYP2">B</InputGroup.Text>
                        <Form.Select aria-label="B" aria-describedby="MYP2" defaultValue={student.MYP[1]||""}>
                            {myp_options}
                        </Form.Select> 
                    </InputGroup> 
                </Col>  
                <Col xs={2} >
                    <InputGroup className="mb-1">
                        <InputGroup.Text id="MYP3">C</InputGroup.Text>
                        <Form.Select aria-label="C" aria-describedby="MYP3" defaultValue={student.MYP[2]||""}>
                            {myp_options}
                        </Form.Select> 
                    </InputGroup> 
                </Col>  
                <Col xs={2} >
                    <InputGroup className="mb-1">
                        <InputGroup.Text id="MYP4">D</InputGroup.Text>
                        <Form.Select aria-label="D" aria-describedby="MYP4" defaultValue={student.MYP[3]||""}>
                            {myp_options}
                        </Form.Select> 
                    </InputGroup> 
                </Col>
            </Row>
            }            
            <Row className="d-flex mt-3">
                <FloatingLabel className="commentLabel" controlId="commentTextArea" label="Comment">
                    <Form.Control
                    as="textarea"
                    placeholder="Enter comment here"
                    style={{ height: '150px' }}
                    value = {student.comment}
                    onChange={(e) => {updateComment(e)}}
                    />
                </FloatingLabel>
            </Row>
        </Container>
    );
}