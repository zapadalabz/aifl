import React, {useState} from "react";
import Modal from "../Modal/Modal";
import { Container, Row, Col } from 'react-bootstrap';

import FloatingLabel from 'react-bootstrap/FloatingLabel'
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagic } from "@fortawesome/free-solid-svg-icons/faWandMagic";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons/faWandMagicSparkles";

import { postGeneratePossibleComments } from "../../scripts/openAI";

export default function ReportCommentModal({showModal, handleClose, index}) {
    const [commentTitle, setCommentTitle] = useState("");
    const [commentDesc, setCommentDesc] = useState("");
    const [generatedComment, setGeneratedComment] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);


    const handleGenerate = () => {
        if(!isGenerating){
            setIsGenerating(true);
            postGeneratePossibleComments(commentTitle, commentDesc).then((response) => {
                setGeneratedComment(response);
                console.log(response);
                setIsGenerating(false);
            });
        }
    }

    return(
        <Modal show={showModal} handleClose={handleClose}>
            <Container>
                <Row>
                    <Col xs={4}>
                        <InputGroup className="mb-1">
                            <InputGroup.Text id="comment-title">Title</InputGroup.Text>
                            <Form.Control
                                type="text"
                                id="comment-title-input"
                                aria-describedby="comment-title"
                                placeholder="Enter Comment Title"
                                maxLength={28}
                                value={commentTitle}
                                onChange={(e) => setCommentTitle(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col xs={4}>
                    </Col>
                    <Col xs={4} className="float-end">
                        <FontAwesomeIcon className="fa-1x mx-2 generateCommentWand" icon={isGenerating?faWandMagicSparkles:faWandMagic} onClick={() => handleGenerate()}/>
                    </Col>
                </Row>
                <Row className="my-3">
                    <FloatingLabel className="commentLabel" controlId="commentTopicDesc" label="Description">
                        <Form.Control
                            as="textarea"
                            placeholder="Describe your criteria for this comment"
                            style={{ height: '100px' }}
                            value = {commentDesc}
                            onChange={(e) => setCommentDesc(e.target.value)}
                            maxLength={200}
                        />
                    </FloatingLabel>
                </Row>
                <Row>
                <FloatingLabel className="commentLabel" controlId="commentTopicGenerated" label="Generated Comments">
                        <Form.Control
                            as="textarea"
                            placeholder="List of possible comments"
                            style={{ height: '250px' }}
                            value = {generatedComment}
                            onChange={(e) => setGeneratedComment(e.target.value)}
                        />
                    </FloatingLabel>
                </Row>
            </Container>
        </Modal>
    )
}