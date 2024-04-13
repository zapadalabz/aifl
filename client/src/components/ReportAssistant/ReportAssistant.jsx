import React, { useState, useReducer, useEffect, useRef } from "react";
import { Container, Row, Col } from 'react-bootstrap';

import ReportNavLeft from "./ReportNavLeft";
import ReportNavBottom from "./ReportNavBottom";
import StudentBox from "./StudentBox";
import '../../styles/report_assistant.css';
import StudentContext from "./StudentContext";
import rootReducer from "./student_reducer";
import { updateUser, getCourses, getActiveClasses } from "../../scripts/managebac";
import { getUserByEmail } from "../../scripts/mongo";
import ReportCommentModal from "./ReportCommentModal";

const initialState = {courses: {}, selectedCourses: [], commentBank: [{title:"",desc:"",comments:""}], selectedCommentHeading: 0};

export default function ReportAssistant({user, setUser}) {
    const [state, dispatch] = useReducer(rootReducer, initialState);
    const [courses, setCourses] = useState([{"id": 12403892, "reporting_period": {'id':204994,'program_code':"Midterm Report Card"}, "code": "SPH3UH-1", "program": "diploma"}]);
    const [showModal, setShowModal] = useState(false);
    const [commentState, setCommentState] = useState(false);
    const reportMainRef = useRef(null);
    const focusedStudent = useRef(null);

    useEffect(() => {
        const getData = async () => {
            try {
                //const result = await getActiveClasses(user.managebacID)
                //setCourses(result);
                //console.log(result);
                const courseResult = await getCourses(user.email, courses);
                //setClassLists(courseResult);
                dispatch({
                    type: 'INIT',
                    payload: {
                        courses: courseResult,
                        selectedCourses: [],
                        commentBank: [{title: "Comment 1", desc: "", comments: ""},{title: "Comment 2", desc: "", comments: ""},{title: "Comment 3", desc: "", comments: ""},{title: "Comment 4", desc: "", comments: ""}],
                        selectedCommentHeading: 0,
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
            //console.log("User initialized");
        }else{
            getData();
            //console.log("User already initialized");
        }
    },[]);

    const studentsToDisplay = () => {
        let display = [];
        let courses = state.selectedCourses;
        //console.log(state.courses);
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

    const handleEditClick = ()  => {
        setShowModal(true);
    }

    const handleCommentClick = (comment) => {
        //console.log(focusedStudent.current);
        //console.log(state.courses[focusedStudent.current.course_id].studentList[focusedStudent.current.student_index].first_name);
        const newComment = state.courses[focusedStudent.current.course_id].studentList[focusedStudent.current.student_index].comment + " " + comment;
        dispatch({
          type: 'UPDATE_STUDENT',
          payload: {
            student_id: focusedStudent.current.student_id,
            course_id: focusedStudent.current.course_id,
            updates: {comment: newComment},
          }
        });
      }

    const handleModalClose = () => {
        dispatch({
            type: 'UPDATE_COMMENT_BANK',
            payload: {
                commentBank: state.commentBank
            }
        });
        setShowModal(false);
    }

    const handleScroll = () => {
        if(state.selectedCourses.length > 0){
            let index = Math.abs(Math.ceil((reportMainRef.current.children[0].getBoundingClientRect().top)/(reportMainRef.current.children[0].getBoundingClientRect().top-reportMainRef.current.children[1].getBoundingClientRect().top)));
            for(let i=0;i<state.selectedCourses.length;i++){
                if(index < state.courses[state.selectedCourses[i]].studentList.length){
                    focusedStudent.current = {course_id: state.selectedCourses[i], student_id: state.courses[state.selectedCourses[i]].studentList[index].id, student_index: index};
                    //console.log(focusedStudent.current);
                    //console.log(state.courses[focusedStudent.current.course_id].studentList[focusedStudent.current.student_index].first_name);
                    break;
                }else{
                    index -= state.courses[state.selectedCourses[i]].studentList.length;
                }
            }
        }
    };

    //console.log(state);   

    return (
        <StudentContext.Provider value={{state, dispatch}}>
            <Container fluid className="reportContainer">
                <Row style={{height:'65%'}} >
                    {!commentState&&
                    <Col xs={2} className="reportNavLeft">
                        <ReportNavLeft courses={courses}/>
                    </Col>}                    
                    <Col xs={10} ref={reportMainRef} onScroll={handleScroll} className="reportMain">
                        {studentsToDisplay()}                           
                    </Col>            
                </Row>
                <Row className="reportNavBottom">
                    <ReportNavBottom user={user} handleEditClick={handleEditClick} handleCommentClick={handleCommentClick} commentState={commentState} setCommentState={setCommentState}/>  
                </Row>                     
            </Container>
            {state.commentBank.length>0&&<ReportCommentModal showModal={showModal} handleClose={handleModalClose} token={user.token}/>}
        </StudentContext.Provider>

    );
}