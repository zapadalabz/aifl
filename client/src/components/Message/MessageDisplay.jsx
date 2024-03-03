import React, { useEffect } from "react";
import ribbit from "../../img/ribbit.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faImage, faLink } from "@fortawesome/free-solid-svg-icons";
// Importing react-syntax-highlighter
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
// Import a theme of your choice
import { atomOneDarkReasonable } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css'; // Import the CSS


const MessageDisplay = ({ messages, messagesEndRef }) => {
  
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

  const renderMessageContent = (m) => {
    switch (m.type) {
      case 'text':
        return <p>{m.content}</p>;
      case 'image':
        return <img src={m.content} alt="Message Attachment" className="messageImage" />;
      case 'link':
        return <a href={m.content} target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLink} /> Open Link</a>;
      case 'code':
        // Using react-syntax-highlighter for code snippet
        return (
          <SyntaxHighlighter language="javascript" style={atomOneDarkReasonable}>
            {m.content}
          </SyntaxHighlighter>
        );
      default:
        // Split the content into segments
        const segments = m.content.split('```');
        return segments.map((segment, index) => {
            // Even indices are regular text, odd indices are code snippets
            if (index % 2 === 0) {
                return <MarkdownComponent input={segment} key={index}/>;
            } 
            else {
                function getLanguage(segment) {
                    const lines = segment.split('\n');
                    const language = lines[0];
                    return language;
                }
                
                try{
                    return (
                        <SyntaxHighlighter language= {getLanguage(segment)} style={atomOneDarkReasonable} key={index}>
                            {segment}
                        </SyntaxHighlighter>
                    );
                }catch(error)
                {
                    return <p key={index}>{segment}</p>;
                }                
            }
        });
    }
  };

  return (
    <div className="messageListContainer">
      <div className="messageListScrollbar">
        {messages.map((m, i) => {
          if (m.role === "assistant") {
            return (
              <div key={i} className="messageIncoming">
                <img src={ribbit} alt="Assistant Avatar" className="messageAvatar" />
                <div className="d-flex flex-column">
                    {renderMessageContent(m)}
                </div>
              </div>
            );
          } else if (m.role === "user") {
            return (
              <div key={i} className="messageOutgoing">
                {renderMessageContent(m)}
                {m.attachments.length > 0 && (
                  <>
                    <br /><br />
                    <span className="fa-layers fa-fw">
                      <FontAwesomeIcon className="fa-2x attachIconMessage" icon={faFilePdf} />
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
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageDisplay;
