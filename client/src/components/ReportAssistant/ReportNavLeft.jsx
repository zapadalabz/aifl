import React, { useContext } from "react";
import Select from 'react-select';
import { Container, Row } from 'react-bootstrap';
import StudentContext from "./StudentContext";


export default function ReportNavLeft({courses}) {
    const {state, dispatch} = useContext(StudentContext);
    let options = [];
    for (const course of courses) {
        options.push({value: course.id, label: course.code});
    }

    const handleCourseChange = (selected) => { // Function to handle change in selections
        dispatch({
            type: 'UPDATE_SELECTED_COURSES',
            payload: {
                selectedCourses: selected.map(option => option.value)
            }
          });
    }

    return (
        <Container fluid>
            <Row>
                <Select className="course-select"
                    isRtl={true}
                    closeMenuOnSelect={false}
                    defaultValue={null}
                    isMulti
                    name="Courses"
                    placeholder="Select Courses"
                    noOptionsMessage={() => "No courses found"}
                    options={options}
                    onChange={handleCourseChange}
                />
            </Row>
            <Row className="mt-2 mx-0">
                Export Grade Template
            </Row>
            <Row className="mt-2 mx-0">
                Import Grade Template
            </Row>
        </Container>
    );
}
