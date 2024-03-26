import { PROXY } from "./config";
import { toast } from 'react-toastify';

async function updateUser(userObject){
    try{
        const managebacResponse = await fetch(`${PROXY}/managebac/getID/${userObject.email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
            });
        var managebacID = await managebacResponse.json();

        if (!managebacResponse.ok) {
            throw new Error(managebacID.toString());
        }

        userObject["managebacID"] = managebacID.id;
        console.log(Object.keys(userObject));
        const update = await fetch(`${PROXY}/users/upsert`, {
            method: "POST",
            body: JSON.stringify(
                {"userObject": userObject, 
            }),
            headers: {
            'Content-Type': 'application/json'
            },
        });

        if (!update.ok) {
            throw new Error(`HTTP error! Status: ${update.status}`);
        }

        console.log(await update.json());
    }
    catch(error){
        toast.error(error.toString());
    }
}

async function getActiveClasses(teacherID){
    //console.log(teacherID);
    try{
        const response = await fetch(`${PROXY}/managebac/getClasses/${teacherID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        var classes = await response.json();
        let activeClasses = [];
        for (const item of classes) {
            const classResponse = await fetch(`${PROXY}/managebac/getClassProgram/${item.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            var classJSON = await classResponse.json();
            //console.log(classJSON);
            var program_code = classJSON.program_code;
            var class_id = classJSON.id;
            const reporting_period = await getAcademicYear(program_code);
            //console.log(reporting_period);
            activeClasses.push({"id": class_id, "reporting_period": reporting_period, "code": item.code, "program": program_code});
        }
        return activeClasses;
    }
    catch(error){
        toast.error(error.toString());
    }
}

async function initClassLists(email, course){
    try{        
        const studentResponse = await fetch(`${PROXY}/managebac/getStudentList/${course.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!studentResponse.ok) {
            throw new Error(`HTTP error! Status: ${studentResponse.status}`);
        }

        var student_ids = (await studentResponse.json()).student_ids;
        //console.log(student_ids);
        var studentList = [];
        for (const student of student_ids) {
            const studentInfo = await fetch(`${PROXY}/managebac/getStudent/${student}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            var studentObj = await studentInfo.json();
            studentObj.overall = '';
            studentObj.comment = "Nothing yet.";
            studentObj.ATL = ['E','E','E','E'];
            if(course.program === "myp"){
                studentObj.MYP = [];
            }            
            studentObj.locked = false;
            studentList.push(studentObj);
        }
        
        // Reorder studentList alphabetically by last_name
        
        studentList = studentList.sort((a, b) => {
            if (a.last_name === b.last_name) {
                return a.first_name.localeCompare(b.first_name);
            } else {
                return a.last_name.localeCompare(b.last_name);
            }
        });

        const courseObj = {
            "class_id": course.id,
            "reporting_period": course.reporting_period,
            "email": email,
            "course_code": course.code,
            "studentList": studentList,
            "program_code": course.program,
        }
        //console.log(courseObj);
        const update = await fetch(`${PROXY}/courses/update`, {
            method: "POST",
            body: JSON.stringify(
                {"courseObj": courseObj, 
            }),
            headers: {
            'Content-Type': 'application/json'
            },
        });
        return courseObj;
        //console.log(await update.json());
    }
    catch(error){
        toast.error(error.toString());
        return null;
    }
}

async function getCourses(email, courses){
    let classes = {};
    for(const course of courses){
        try{
            const response = await fetch(`${PROXY}/courses/get`, {
                method: 'POST',
                body: JSON.stringify(
                    {"email": email,
                    "reporting_period": course.reporting_period,
                    "course_code": course.code,
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            let classResponse = await response.json();
            if (!response.ok) {
                throw new Error(classResponse.toString());
            }
            //console.log(classResponse);
            if(classResponse){
                classes[course.id] = classResponse;
            }else{
                classes[course.id] = await initClassLists(email, course);
            }
        }
        catch(error){
            toast.error(error.toString());
        }
    }
    return classes;   
}

async function getSchoolDetails(){
    try{
        const response = await fetch(`${PROXY}/managebac/getSchoolDetails`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        //var details = await response.json();
        //console.log(details);
    }
    catch(error){
        toast.error(error.toString());
    }
}

async function getAcademicYear(program){
    try{
        const response = await fetch(`${PROXY}/managebac/getAcademicYears`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        var year = await response.json();

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        var currentYear = year.academic_years.diploma.academic_years.length-1;
        //console.log(currentYear);
        var academic_terms = year.academic_years[program].academic_years[currentYear].academic_terms;
        
        var currentDate = new Date();
        var currentTerm = null;

        for (var i = 0; i < academic_terms.length; i++) {
            var term = academic_terms[i];
            var startsOn = new Date(term.starts_on);
            var endsOn = new Date(term.ends_on);

            if (currentDate >= startsOn && currentDate <= endsOn) {
                currentTerm = {"id": term.id, "name": term.name};
                break;
            }
        }

        if (currentTerm) {
            return currentTerm;
        } else {
            return {"id": null, "name": null};
        }

    }
    catch(error){
        toast.error(error.toString());
    }
}

async function getUserRole(email){
    try{
        const response = await fetch(`${PROXY}/managebac/getRole/${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        var role = await response.json();

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return role.role;
    }
    catch(error){
        toast.error(error.toString());
    }
}

//updateUser('zmedendorp@branksome.on.ca'); //add the managebacID to user
//getSchoolDetails();
//getAcademicYear("diploma");
//initClassLists(13235099,'zmedendorp@branksome.on.ca');




export {updateUser, getCourses, initClassLists, getSchoolDetails, getAcademicYear, getActiveClasses, getUserRole};