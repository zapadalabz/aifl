let initialStudentsState = []
function studentsReducer(state = initialStudentsState, action) {
  //console.log(state, action);
  switch (action.type) {
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
      state[action.payload.student_index] = { ...state[action.payload.student_index], ...action.payload.updates };
      return state;
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
      case "UPDATE_SELECTED_COURSELIST":
        return {
          ...state,
          courseList: action.payload.courseList,// Array of student data for selected course
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
    case "UPDATE_STUDENT":
      let students = state.courseList;
      students[action.payload.student_index] = { ...students[action.payload.student_index], ...action.payload.updates }; 
      return {
        ...state,
        pending_updates: {
          ...state.pending_updates,
          [students[action.payload.student_index].id]: students[action.payload.student_index]
        },
        courseList: students
      }
    case "CLEAR_PENDING":
      return {
        ...state,
        pending_updates: {}// Array of student ids
      }
    default:
      return {
        ...state,
        courseList: coursesReducer(state.courseList, action),
        // Add more reducers as your state grows
      };
  }
}