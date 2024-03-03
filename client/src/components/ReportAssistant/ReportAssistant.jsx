import React, { useState, useReducer, useEffect } from "react";
import { Container, Row, Col } from 'react-bootstrap';

import ReportNavLeft from "./ReportNavLeft";
import ReportNavBottom from "./ReportNavBottom";
import StudentBox from "./StudentBox";
import '../../styles/report_assistant.css';
import StudentContext from "./StudentContext";
import rootReducer from "./student_reducer";
import { updateUser, getCourses, initClassLists, getActiveClasses } from "../../scripts/managebac";
import { getUserByEmail } from "../../scripts/mongo";
import ReportCommentModal from "./ReportCommentModal";

const initialState = {courses: {}, selectedCourses: []};

export default function ReportAssistant({user, setUser}) {
    const [state, dispatch] = useReducer(rootReducer, initialState);
    const [courses, setCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [classLists, setClassLists] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const getData = async () => {
            try {
                const result = await getActiveClasses(user.managebacID)
                setCourses(result);
                const courseResult = await getCourses(user.email, result)
                setClassLists(courseResult);
                dispatch({
                    type: 'INIT',
                    payload: {
                        courses: courseResult,
                        selectedCourses: [],
                    }
                  });
            } catch (error){
                console.log(error);
            }    
        }
        const initializeUser = async () => {
            try {
                await updateUser(user);
                const updatedUser = await getUserByEmail(user.email);
                setUser(updatedUser);
                await getData();
            } catch(error) {
                console.log(error);
            }
        }
        if(!user.managebacID){
            initializeUser();
        }else{
            getData();
        }
    },[]);

    const studentsToDisplay = () => {
        let display = [];
        let courses = state.selectedCourses;
        if (courses.length > 0){
            for (let i = 0; i < courses.length; i++){
                const studentBoxes = state.courses[courses[i]].studentList.map((student, index) => {
                    return <StudentBox key={i + "." + index} student={student} course_id={courses[i]}/>
                });
                display = [...display, ...studentBoxes];
            }        
        }
        
        if (display.length === 0){
            return <div>No students to display</div>
        } else {
            return display;
        }                 
    }

    const handleEditClick = (index)  => {
        setShowModal(true);
        console.log(index);
    }

    const handleModalClose = () => {
        setShowModal(false);
    }

    //console.log(state);   

    return (
        <StudentContext.Provider value={{state, dispatch}}>
            <Container fluid className="reportContainer">
                <Row style={{height:'70%'}} >
                    <Col xs={2} className="reportNavLeft">
                        <ReportNavLeft courses={courses} setSelectedCourses={setSelectedCourses}/>
                    </Col>
                    <Col xs={10} className="reportMain">
                        {studentsToDisplay()}                           
                    </Col>            
                </Row>
                <Row className="reportNavBottom">
                    <ReportNavBottom handleEditClick={handleEditClick}/>  
                </Row>                     
            </Container>
            <ReportCommentModal showModal={showModal} handleClose={handleModalClose}/>
        </StudentContext.Provider>

    );
}