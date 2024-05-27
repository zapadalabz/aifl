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

export default function StudentBox({student, student_index, handleUpdateStudent}) {
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

    const updateComment = (e) => {
        dispatch({
            type: 'UPDATE_STUDENT',//UPDATE COMMENT
            payload: {
              student_index: student_index,
              updates: {comment: e.target.value},
            }
          });
    }

    const handleSelectChange = (e, fieldName) => {
        dispatch({
            type: 'UPDATE_STUDENT', // You might need to handle different payload structure or action types for other fields.
            payload: {
                student_index: student_index,
                updates: {[fieldName]: e.target.value},
            }
        });
    }

    const processOverallMark = (mark) => {
        //console.log("Initial Mark: ", mark);
        
        if(mark[0] === "N"){
            //console.log("Returning 'N'");
            return "N";
        } else if(mark.includes(" ")){
            const splitMark = mark.split(" ")[0];
            //console.log("Split Mark: ", splitMark);
            return splitMark;
        } else {
            //console.log("Returning Mark or Empty: ", mark || "");
            return mark || "";
        }
    }

    return (
        <Container fluid className="studentBoxContainer">
            <Row className="studentBoxName" >
                {student.name}          
            </Row>
            <Row className="d-flex my-2" >
                <Col xs={3} >
                    <InputGroup className="mb-1">
                        <InputGroup.Text id="overall-grade">Overall</InputGroup.Text>
                        <Form.Select aria-label="Overall" aria-describedby="overall-grade" value={processOverallMark(student["Overall Mark"])} onChange={(e) => {handleSelectChange(e, "Overall Mark")}}>
                            {grade_options}
                        </Form.Select> 
                    </InputGroup>
                </Col>
                <Col xs={2} >
                    <InputGroup className="mb-1">
                        <InputGroup.Text id="ATL1">O</InputGroup.Text>
                        <Form.Select aria-label="Organization" aria-describedby="ATL1" value={student["Organization"]||"E"} onChange={(e) => {handleSelectChange(e, "Organization")}}>
                            {atl_options}
                        </Form.Select> 
                    </InputGroup> 
                </Col>
                <Col xs={2} >
                    <InputGroup className="mb-1">
                        <InputGroup.Text id="ATL2">SR</InputGroup.Text>
                        <Form.Select aria-label="Self-Regulation" aria-describedby="ATL2"  value={student["Self Regulation"]||'E'} onChange={(e) => {handleSelectChange(e, "Self Regulation")}}>
                            {atl_options}
                        </Form.Select> 
                    </InputGroup> 
                </Col>  
                <Col xs={2} >
                    <InputGroup className="mb-1">
                        <InputGroup.Text id="ATL3">C</InputGroup.Text>
                        <Form.Select aria-label="Collaboration" aria-describedby="ATL3"  value={student["Collaboration"]||'E'} onChange={(e) => {handleSelectChange(e, "Collaboration")}}>
                            {atl_options}
                        </Form.Select> 
                    </InputGroup> 
                </Col>  
                <Col xs={2} >
                    <InputGroup className="mb-1">
                        <InputGroup.Text id="ATL4">L</InputGroup.Text>
                        <Form.Select aria-label="Leadership" aria-describedby="ATL4"  value={student["Leadership"]||'E'} onChange={(e) => {handleSelectChange(e, "Leadership")}}>
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
                        <Form.Select aria-label="A" aria-describedby="MYP1" value={student.MYP[0]||""}>
                            {myp_options}
                        </Form.Select> 
                    </InputGroup> 
                </Col>
                <Col xs={2} >
                    <InputGroup className="mb-1">
                        <InputGroup.Text id="MYP2">B</InputGroup.Text>
                        <Form.Select aria-label="B" aria-describedby="MYP2" value={student.MYP[1]||""}>
                            {myp_options}
                        </Form.Select> 
                    </InputGroup> 
                </Col>  
                <Col xs={2} >
                    <InputGroup className="mb-1">
                        <InputGroup.Text id="MYP3">C</InputGroup.Text>
                        <Form.Select aria-label="C" aria-describedby="MYP3" value={student.MYP[2]||""}>
                            {myp_options}
                        </Form.Select> 
                    </InputGroup> 
                </Col>  
                <Col xs={2} >
                    <InputGroup className="mb-1">
                        <InputGroup.Text id="MYP4">D</InputGroup.Text>
                        <Form.Select aria-label="D" aria-describedby="MYP4" value={student.MYP[3]||""}>
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
                    onChange={(e) => {handleSelectChange(e, "comment")}}
                    />
                </FloatingLabel>
            </Row>
        </Container>
    );
}