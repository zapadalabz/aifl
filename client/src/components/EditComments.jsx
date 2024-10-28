import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { toast } from 'react-toastify';
import { ProcessComments } from '../scripts/openAI';
import { commentsToDocx } from '../scripts/processFile';

import CommentCard from './CommentCard';

const EditComments = ({ token }) => {
    const [comments, setComments] = useState('');
    const [processedComments, setProcessedComments] = useState([]);
    const [processing, setProcessing] = useState(false);

    const processComments = async (comments) => {
        const handleCommentsUpdate = (commentsArrayUpdate) => {
            //console.log(commentsArrayUpdate);
            setProcessedComments(commentsArrayUpdate);
        }
        try {
            setProcessing(true);
            const commentsArray = await ProcessComments(comments, token, handleCommentsUpdate);
            setProcessing(false);
            return commentsArray;
        } catch (err) {
            alert(`Error: ${err.message}`);
            toast.error(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await processComments(comments);
        setProcessedComments(result);
    };

    const handleExport = () => {
        commentsToDocx(processedComments);
    };

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <FloatingLabel controlId="floatingTextarea" label="Enter Report Card Comments" className="mb-3">
                    <Form.Control
                        as="textarea"
                        placeholder="Enter one comment per line"
                        style={{ height: '200px' }}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                    />
                </FloatingLabel>
                <Button type="submit" disabled={processing}>{processing?"Processing...":"Suggest Edits"}</Button>
                <br />
                <br />
                <Button type="button" disabled={processing||processedComments.length === 0} onClick={() => handleExport()}>Export to docx</Button>
            </Form>
            {processedComments.length > 0 && (
                processedComments.map((comment, index) => (
                        <CommentCard comment={comment} key={index} />
                    ))
            )}
        </div>
    );
};

export default EditComments;