import React, { useContext, useState } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faFolderOpen, faFloppyDisk, faCirclePlay, faCircleStop } from "@fortawesome/free-regular-svg-icons";
import { getComments, updateComments } from "../../scripts/mongo";

import StudentContext from "./StudentContext";
import SaveModal from "./SaveModal";
import OpenModal from "./OpenModal";

export default function ReportNavBottom({user, handleEditClick, handleCommentClick, commentState, setCommentState}) {
  const {state, dispatch} = useContext(StudentContext);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [userCommentBank, setUserCommentBank] = useState([]);
  //const [commentState, setCommentState] = useState(false);

  const handleHeadingClick = (index) => {
    dispatch({
      type: 'SET_SELECTED_COMMENT_HEADING',
      payload: {
          selectedCommentHeading: index,
      }
    });
  }

  const handleOpenClick = () => {
    getComments(user.email).then((response) => {
      console.log(user.email);
      setUserCommentBank(response);
      setShowOpenModal(!showOpenModal);
    }).catch((error) => {console.log(error)});
    console.log("Open Clicked");
  }

  const handleOpenClose = () => {
    setShowOpenModal(false);
  }

  const handleOpen = (index) => {
    console.log(index);
  }

  const handleSaveClick = () => {
    console.log("Save Clicked");
    setShowSaveModal(!showSaveModal);
  }

  const handleSaveClose = () => {
    setShowSaveModal(false);
  }

  const handleSave = (filename) => {
    console.log(filename);
    updateComments(user.email, filename, state.commentBank);
  }

  const handlePlayClick = () => {
    console.log("Play Clicked");
    setCommentState(!commentState);
  }

  const SelectableComments = () => {
    const comments = state.commentBank[state.selectedCommentHeading].comments;
    
    if (comments.includes('\n\n')) {
      const commentArray = comments.split('\n\n');
      return commentArray.map((comment, index) => (
        <div className="selectableComment" key={index} onClick={()=>handleCommentClick(comment)}>{comment}</div>
      ));
    } else {
      return <div className="selectableComment" onClick={()=>handleCommentClick(comments)}>{comments}</div>
    }    
  }


  return (
    <Container fluid className="navBottomContainer">
        <Row>
            <Col xs={2} className="d-flex flex-column flex-start align-items-start commentHeadingContainer">
              <Row className="commentMenu">
                {!commentState&&
                <Col className="d-flex justify-content-start">
                  <FontAwesomeIcon className="fa-1x mx-2 commentMenuItem" icon={faFolderOpen} onClick={() => handleOpenClick()}/>
                  <FontAwesomeIcon className="fa-1x mx-2 commentMenuItem" icon={faFloppyDisk} onClick={() => handleSaveClick()}/>
                </Col>}                
                <Col className="d-flex justify-content-end">
                  <FontAwesomeIcon className={`fa-3x commentToggle commentMenuItem ${commentState && "stopButton"}`} icon={commentState?faCircleStop:faCirclePlay} onClick={() => handlePlayClick()}/>
                </Col>
              </Row>
              {state.commentBank.map((heading, index) => {
                return (
                  <div key={heading.title} className={`commentHeading ${index === state.selectedCommentHeading ? "selectedHeading" : ""}`} onClick={() => handleHeadingClick(index)}>
                    {heading.title}
                    {!commentState&&<FontAwesomeIcon className="fa-1x mx-2 editCommentButton" icon={faPenToSquare} onClick={() => handleEditClick()}/>}
                  </div>
                );
              })}            
            </Col>
            <Col xs={10} className="selectableCommentsContainer">
                {state.commentBank[state.selectedCommentHeading].comments===""?<>No Comments Yet</>:<SelectableComments/>}
            </Col>
        </Row>
        <SaveModal showSaveModal={showSaveModal} handleSave={handleSave} handleSaveClose={handleSaveClose}/>
        <OpenModal showOpenModal={showOpenModal} handleOpen={handleOpen} handleOpenClose={handleOpenClose} userCommentBank={userCommentBank}/>       
    </Container>
  );
}