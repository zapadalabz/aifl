import React, { useState, useReducer, useEffect, useRef } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';

import ReportNavLeft from "./ReportNavLeft";
import ReportNavBottom from "./ReportNavBottom";
import StudentBox from "./StudentBox";
import '../../styles/report_assistant.css';
import StudentContext from "./StudentContext";
import rootReducer from "./student_reducer";
import { updateUser, getCourses, getActiveClasses } from "../../scripts/managebac";
import { managebacLogin, getClass, updateStudent, updateStudentList } from "../../scripts/playwright";
import { getUserByEmail } from "../../scripts/mongo";
import ReportCommentModal from "./ReportCommentModal";
import PasswordModal from "./PasswordModal";

const initialState = {courses: {}, selectedCourses: [], courseList: [], pending_updates: {}, commentBank: [{title:"",desc:"",comments:""}], selectedCommentHeading: 0};

export default function ReportAssistant({user, setUser}) {
    const [state, dispatch] = useReducer(rootReducer, initialState);
    const [courses, setCourses] = useState([]); //{"id": 12403892, "reporting_period": {'id':204994,'program_code':"Midterm Report Card"}, "code": "SPH3UH-1", "program": "diploma"}
    const [showModal, setShowModal] = useState(false);
    const [commentState, setCommentState] = useState(false);
    const reportMainRef = useRef(null);
    const focusedStudent = useRef(null);
    const [loggedIn, setLoggedIn] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentClassList, setCurrentClassList] = useState([]);
    const [reportingTerm, setReportingTerm] = useState("");
    const [fetchingData, setFetchingData] = useState(false);

    const getData = async () => {
        try {
            setFetchingData(true);
            const courses = await managebacLogin(user.email, loggedIn);
            setCourses(courses);
            setFetchingData(false);
            //const courseResult = await getCourses(user.email, courses);
            //setClassLists(courseResult);
            dispatch({
                type: 'INIT',
                payload: {
                    courses: courses,
                    selectedCourses: [],
                    courseList: [],
                    pending_updates: {},
                    commentBank: [{title: "Comment 1", desc: "", comments: ""},{title: "Comment 2", desc: "", comments: ""},{title: "Comment 3", desc: "", comments: ""},{title: "Comment 4", desc: "", comments: ""},{title: "Comment 5", desc: "", comments: ""}],
                    selectedCommentHeading: 0,
                }
              });
              
        } catch (error){
            console.log(error);
        }    
    }
    console.log(state);
    useEffect(() => {        
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
        if(!loggedIn){
            setShowPasswordModal(true);
            console.log("Login to Managebac");
        }else{
            getData();
            //console.log("User already initialized");
        }
    },[]);

    useEffect(() => {
        if(loggedIn){
            getData();
        }
    },[loggedIn]);

    useEffect(() => {
        if(state.selectedCourses.length > 0){
            const getClasses = async () => {
                try {
                    setFetchingData(true);
                    const classInfo = await getClass(user.email, state.selectedCourses[0]);
                    dispatch({
                        type: 'UPDATE_SELECTED_COURSELIST',
                        payload: {
                            courseList: classInfo.studentList,
                        }
                      });
                    setReportingTerm(classInfo.term);
                    setFetchingData(false);
                } catch (error){
                    console.log(error);
                }
            }
            getClasses();
        }
    },[state.selectedCourses]);

    const timerRef = useRef(null);
    // Start or reset the 500ms timer whenever pendingUpdates changes
    useEffect(() => {
        if (Object.keys(state.pending_updates).length > 0) {
            // Clear any existing timer
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            // Set a new timer
            timerRef.current = setTimeout(() => {
                updateStudentList(user.email, state.pending_updates).then(()=>{
                    dispatch({
                        type:  'CLEAR_PENDING',
                        payload: {}
                    });                
                });
            }, 1500);
        }

        // Cleanup function: Clear the timer when the component unmounts
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [state.pending_updates]);

    //console.log(state);
    const handleUpdateStudent = (student) => {
        updateStudent(user.email, student);
    }

    const studentsToDisplay = () => {
        // If data is being fetched, show appropriate messages.
        if (fetchingData) {
          const message = state.selectedCourses[0] 
            ? "Fetching Students from Managebac..."
            : "Fetching Courses from Managebac...";
          return <div>{message}</div>;
        }
      
        // If no course is selected, prompt the user to select one.
        if (!state.selectedCourses[0]) {
          return <div>Select a course to display students.</div>;
        }
        //console.log(state.courseList);
        // If a course is selected and the class list is not empty, display the students.
        if (state.courseList.length > 0) {
          const studentBoxes = state.courseList.map((student, index) => (
            <StudentBox key={student.name} student_index={index} student={student} handleUpdateStudent={handleUpdateStudent} />
          ));
          return studentBoxes;
        }
      
        // If we've reached this point, no students are present to display.
        return <div>No students available for the selected course.</div>;
      };

    const handleEditClick = ()  => {
        setShowModal(true);
    }

    const handleCommentClick = (comment) => {
        //console.log(focusedStudent.current);
        //console.log(state.courses[focusedStudent.current.course_id].studentList[focusedStudent.current.student_index].first_name);
        const newComment = state.courseList[focusedStudent.current.student_index].comment + " " + comment;
        dispatch({
          type: 'UPDATE_STUDENT',
          payload: {
            student_index: focusedStudent.current.student_index,
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

    const handlePasswordClose = (password) => {
        setLoggedIn(password);
        setShowPasswordModal(false);
    }

    const handleScroll = () => {
        if(state.selectedCourses.length > 0){
            try{
                let index = Math.abs(Math.ceil((reportMainRef.current.children[0].getBoundingClientRect().top)/(reportMainRef.current.children[0].getBoundingClientRect().top-reportMainRef.current.children[1].getBoundingClientRect().top)));
                if(index < state.courseList.length){
                    focusedStudent.current = {course_id: state.selectedCourses[0], student_name: state.courseList[index].name, student_index: index};
                }
            }catch{
                focusedStudent.current = null;
            }
            //console.log(focusedStudent.current);
        }
    };

    //console.log(state);   

    return (
        <StudentContext.Provider value={{state, dispatch}}>
            <Container fluid className="reportContainer">
                <Row style={{height:'65%'}} >
                    {!commentState&&
                    <Col xs={2} className="reportNavLeft">
                        <ReportNavLeft courses={courses} user={user}/>
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
            {showPasswordModal&&<PasswordModal showModal={showPasswordModal}  setLoggedIn={setLoggedIn} handlePasswordClose={handlePasswordClose}/>}
        </StudentContext.Provider>

    );
}