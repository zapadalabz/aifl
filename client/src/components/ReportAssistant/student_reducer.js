let initialStudentsState = []
function studentsReducer(state = initialStudentsState, action) {
  //console.log(state, action);
  switch (action.type) {
    case 'UPDATE_STUDENT':
      return state.map((student) =>
        student.id === action.payload.student_id
          ? { ...student, ...action.payload.updates }
          : student
      );
    case 'UPDATE_OVERALL':
    case 'UPDATE_ATL':
    case 'TOGGLE_LOCK':
      return state.map((student) =>
        student.id === action.payload.student_id
          ? { ...student, ...action.payload.updates }
          : student
      );
    default:
      return state;
  }
}

const initialCoursesState = {};

function coursesReducer(state = initialCoursesState, action) {
  switch (action.type) {
    case 'UPDATE_STUDENT':
      const courseObj = { ...state[action.payload.course_id] };
      courseObj.studentList = studentsReducer(
        courseObj.studentList,
        action
      );
      return { ...state, [action.payload.course_id]: courseObj };
    default:
      return state;
  }
}

export default function rootReducer(state = {}, action) {
  switch (action.type) {
    case "INIT":
      return  action.payload;
    case "UPDATE_SELECTED_COURSES":
      return {
        ...state,
        selectedCourses: action.payload.selectedCourses,// Array of selected courses
      };
    case "UPDATE_COMMENT_BANK":
      const newCommentBank = state.commentBank.map((comment, index) =>
        index === action.payload.index ? action.payload.updates : comment
      );
      return {
        ...state,
        commentBank: newCommentBank,// Array of comments [{title, desc, comments}, ...]
      }
    case "SET_SELECTED_COMMENT_HEADING":
      return {
        ...state,
        selectedCommentHeading: action.payload.selectedCommentHeading//index of selected comment heading
      }
    default:
      return {
        ...state,
        courses: coursesReducer(state.courses, action),
        // Add more reducers as your state grows
      };
  }
}