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
                {m.img && <img src={m.img} alt="User Attachment" className="messageImage" style={{ maxHeight: '250px', maxWidth:'250px', cursor: 'default' }}/>}
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
