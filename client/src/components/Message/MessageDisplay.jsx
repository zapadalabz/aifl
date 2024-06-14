import React, { useEffect } from "react";
import ribbit from "../../img/ribbit.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-regular-svg-icons/faFileLines";
// Importing react-syntax-highlighter
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
// Import a theme of your choice
import { atomOneDarkReasonable } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Button from 'react-bootstrap/Button';

import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css'; // Import the CSS


const MessageDisplay = ({ messages, messagesEndRef, chatSettings, setChatSettings, isThinking }) => {
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const MarkdownComponent = ({ input }) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeKatex]}
      children={input}
    />
  );

const preprocessLaTeX = (content) => {
  // Replace block-level LaTeX delimiters \[ \] with $$ $$

  const blockProcessedContent = content.replace(
    /\\\[(.*?)\\\]/gs,
    (_, equation) => `$$${equation}$$`,
  );
  // Replace inline LaTeX delimiters \( \) with $ $
  const inlineProcessedContent = blockProcessedContent.replace(
    /\\\((.*?)\\\)/gs,
    (_, equation) => `$${equation}$`,
  );
  return inlineProcessedContent;
};

  const renderMessageContent = (m) => {
    switch (m.type) {      
      default:
        // Handle mixed Markdown and code-content efficiently
        const contentSegments = m.content.split(/(```.*\n[\s\S]*?\n```)/g);
        return contentSegments.map((segment, index) => {
          if (segment.startsWith('```') && segment.endsWith('```')) {
            const lines = segment.split('\n');
            let language = lines[0].replace(/```/g, '').trim();
            const codeContent = lines.slice(1, -1).join('\n'); // Get rid of the first and last "```"
            if (language === 'jsx' || language === 'Javascript') { language = 'javascript'; }
            return (
              <SyntaxHighlighter language={language || 'text'} style={atomOneDarkReasonable} key={index}>
                {codeContent}
              </SyntaxHighlighter>
            );
          } else {
            return <MarkdownComponent input={preprocessLaTeX(segment)} key={index} />;
          }
        });
    }
  };

  let messageList = messages.map((m, i) => {
    if (m.role === "assistant") {
      return (
        <div key={i} className="messageIncoming">
          <img src={ribbit} alt="Assistant Avatar" className="messageAvatar" />
          <div className="d-flex flex-column">
              {renderMessageContent(m)}
              {isThinking && i === messages.length - 1 && <div className="thinking"></div>}
          </div>
        </div>
      );
    } else if (m.role === "user") {
      return (
        <div key={i} className="messageOutgoing">
          {m.content}
          {m.img && <img src={m.img} alt="User Attachment" className="messageImage" style={{ maxHeight: '250px', maxWidth:'250px', cursor: 'default' }}/>}
          {m.attachments.length > 0 && (
            <>
              <br /><br />
              <span className="fa-layers fa-fw">
                <FontAwesomeIcon className="fa-2x attachIconMessage" icon={faFileLines} />
                <span className="fa-layers-counter fa-2x" style={{ background: 'Tomato', cursor: 'default' }}>
                  {m.attachments.length}
                </span>
              </span>
            </>
          )}
        </div>
      );
    } else {
      return <div key={i}>System Message: {m.content}</div>;
    }
  });

  const handleSettingsChange = (label, value) => {
    setChatSettings({
      ...chatSettings,
      [label]: value
    })
    localStorage.setItem('chatSettings',JSON.stringify({...chatSettings,[label]: value}));
  }

  const handleRestoreDefaultSettings = () => {
    const defaultSettings = {
      temperature: 0.7,
      system_message: "You are an experienced teacher that responds using Markdown."
    };
    setChatSettings(defaultSettings);
    localStorage.setItem('chatSettings',JSON.stringify(defaultSettings));
  }

  const temperatureCategory = (temperature) => {
    if (temperature < 0.2) {
      return "Predictable";
    } else if (temperature < 0.4) {
      return "Conservative";
    } else if (temperature < 0.6) {
      return "Balanced";
    } else if (temperature < 0.8) {
      return "Creative";
    } else if (temperature < 1.0) {
      return "Unpredictable";
    } else if (temperature < 1.5) {
      return "Crazy Talk";
    } else {
      return "Nonsense";
    }
  }
  let welcomeMessage = (
    <div className="messageIncoming">
      <img src={ribbit} alt="Assistant Avatar" className="messageAvatar" />
      <div className="welcomeMessage">

        <FloatingLabel controlId="sys_msg" label="System Message">
          <Form.Control
            className="systemMessageInput"
            as="textarea"
            placeholder="System Message"
            value = {chatSettings.system_message}
            onChange={(e) => handleSettingsChange("system_message", e.target.value)}
          />
          </FloatingLabel>
            
        <Form.Label><strong>Temperature:</strong> {chatSettings.temperature} ({temperatureCategory(chatSettings.temperature)})</Form.Label>
        <Form.Range 
          value={chatSettings.temperature}
          onChange={(e) => handleSettingsChange("temperature", Number(e.target.value))}
          min={0}
          max={2}
          step={0.1}
        />
        <br/>
        <div className="d-flex justify-content-between align-items-center">
          <em>
            Type a message to get started!
          </em>
          <Button variant="outline-secondary" onClick={handleRestoreDefaultSettings}>Restore default</Button>
        </div>
        
      </div>
      
    </div>
  );

  return (
    <div className="messageListContainer">
      <div className="messageListScrollbar">
        {messageList.length > 0 ? messageList : welcomeMessage}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageDisplay;
