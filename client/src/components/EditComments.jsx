import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { toast } from 'react-toastify';
import { ProcessComments } from '../scripts/openAI';

const EditComments = ({ token }) => {
    const [comments, setComments] = useState('');
    const [processedComments, setProcessedComments] = useState([]);

    useEffect(() => {console.log(processedComments)}, [processedComments]);

    const processComments = async (comments) => {
        try {
            const commentsArray = await ProcessComments(comments, token, setProcessedComments);
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
                <Button type="submit">Submit</Button>
            </Form>
            {processedComments.length > 0 && (
                <Table striped bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Length</th>
                            <th>Spelling & Grammar</th>
                            <th>General Feedback</th>
                            <th>Formatting & Style</th>
                            <th>Content Specific</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processedComments.map((comment, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{comment.Name}</td>
                                <td>{comment.Length}</td>
                                <td>{comment["Spelling & Grammar"]}</td>
                                <td>{comment["General Feedback"]}</td>
                                <td>{comment["Formatting & Style"]}</td>
                                <td>{comment["Content Specific"]}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default EditComments;