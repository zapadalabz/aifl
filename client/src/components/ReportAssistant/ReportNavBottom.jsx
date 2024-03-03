import React, {useState} from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons/faPenToSquare";

export default function ReportAssistant({handleEditClick}) {
  const handlePlusClick = () => {}
  const commentHeadings = [{title:"Comment 1", description:"Introductory Comment"}, {title:"Comment 2", description:"Content Comment"}, {title:"Comment 3", description:"Concluding Comment"},{title:"Comment 4", description:"Extra"}];
  const [selectedHeading, setSelectedHeading] = useState(0);

  const handleHeadingClick = (index) => {
    setSelectedHeading(index);
  }


  return (
    <Container fluid className="navBottomContainer">
        <Row>
            <Col xs={2} className="d-flex flex-column flex-start align-items-start commentHeadingContainer">
              {commentHeadings.map((heading, index) => {
                return (
                  <div key={heading.title} className={`commentHeading ${index === selectedHeading ? "selectedHeading" : ""}`} onClick={() => handleHeadingClick(index)}>
                    {heading.title}
                    <FontAwesomeIcon className="fa-1x mx-2" icon={faPenToSquare} onClick={() => handleEditClick(index)}/>
                  </div>
                );
              })}
            </Col>
            <Col xs={10} className="selectableCommentsContainer">
                Selectable Comments:
                <br/>
                {commentHeadings[selectedHeading].description}
            </Col>
        </Row>

        
    </Container>
  );
}