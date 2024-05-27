import React, { useContext } from "react";
import Select from 'react-select';
import { Container, Row } from 'react-bootstrap';
import StudentContext from "./StudentContext";
import ExportToExcel from "./ExportToExcel";
import ImportFromExcel from "./ImportFromExcel";
import { updateStudentList } from "../../scripts/playwright";
import { toast } from 'react-toastify';


export default function ReportNavLeft({courses, user}) {
    const {state, dispatch} = useContext(StudentContext);

    let options = [];
    const handleImport = (response) => {
        if(response){
            console.log("Importing data...");
        }
    }

    for (const course of courses) {
        options.push({value: course.id, label: course.code});
    }

    const handleCourseChange = (selected) => { // Function to handle change in selections
        console.log(selected);
        dispatch({
            type: 'UPDATE_SELECTED_COURSES',
            payload: {
                selectedCourses: [selected.value],
            }
          });
    }

    return (
        <Container fluid>
            <Row>
                <Select className="course-select"
                    isRtl={true}
                    closeMenuOnSelect={true}
                    defaultValue={null}
                    name="Courses"
                    placeholder="Select Course"
                    noOptionsMessage={() => "No courses found"}
                    options={options}
                    onChange={handleCourseChange}
                />
            </Row>
            <Row className="mt-2 mx-0">
                <ExportToExcel data={state.courseList} fileName={`Template-${state.selectedCourses}`}/>
            </Row>
            <Row className="mt-2 mx-0">
                <ImportFromExcel onDataProcessed={handleImport}/>
            </Row>
            <Row className="mt-2 mx-0">
                <button className="import_export_button" onClick={() => toast.error("Terrible Comments. It's easier to just start over.")}>
                    Apply BH Styling
                </button>
            </Row>
        </Container>
    );
}
