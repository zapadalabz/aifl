import React, { useState } from "react";
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons/faX";

function TagInput({ onTagAdd, onTagRemove, tags}) {
  const [tag, setTag] = useState('');

  const handleTagChange = (e) => setTag(e.target.value);

  const handleTagAdd = () => {
    if (tag) {
      onTagAdd(tag);
      setTag('');
    }
  };


  return (
    <div className="d-flex mb-3">
      <InputGroup style={{ width: '250px' }}>
        <Form.Control
          placeholder="Add a Tag"
          aria-label="Tags"
          aria-describedby="basic-addon2"
          value={tag}
          onChange={handleTagChange}
        />
        <Button variant="outline-secondary" id="addTag" onClick={handleTagAdd}>
          Add Tag
        </Button>
      </InputGroup>
      <div className="favTags">
        {tags.map((tag, index) => (
          <span key={index} className="tagItem">
            {tag} <FontAwesomeIcon className="fa-1x tagX" icon={faX} onClick={()=>{onTagRemove(tag)}}/> {/* Display a cross (×) to indicate removal */}
          </span>
        ))}
      </div>
    </div>
  );
}

const EditView = ({editPrompt, handleSubmit}) => {

    const [prompt, setPrompt] = useState(editPrompt);

    const handleTagAdd = (tag) => {
      setPrompt({
        ...prompt,
        tags: [...prompt.tags, tag],
      });
    };
  
    const handleTagRemove = (tag) => {
      setPrompt({
        ...prompt,
        tags: prompt.tags.filter((t) => t !== tag),
      });
    };

    

    return (
        <>
          <FloatingLabel controlId="promptTextArea" label="Enter prompt here">
            <Form.Control
              as="textarea"
              placeholder="Enter prompt here"
              style={{ height: '200px' }}
              value = {prompt.prompt}
              onChange={(e) => setPrompt({
                ...prompt,
                prompt: e.target.value,
              })}
            />
          </FloatingLabel>
          <div className="publicCheckbox">
            <Form.Check // prettier-ignore
              inline
              type="checkbox"
              id="public"
              label="Public"
              defaultChecked
            />
          </div>
          
          <TagInput onTagAdd={handleTagAdd} onTagRemove={handleTagRemove} tags={prompt.tags} />
          <Button variant="primary" className="mt-2" onClick={() => handleSubmit(prompt)}>
            Submit
          </Button>
        </>
      );
}

export {EditView};