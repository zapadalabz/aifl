import React, {useState, useRef, useEffect} from "react";
//import { MessageInput} from "@chatscope/chat-ui-kit-react";
import { postOpenAIChatResponse } from "../scripts/openAI";
import MessageDisplay from "./Message/MessageDisplay";
import { extractPDFText } from "../scripts/processFile";
import MessageInput from "./Message/MessageInput/MessageInput";
import Overlay from 'react-bootstrap/Overlay';
import Stack from 'react-bootstrap/Stack';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons/faFilePdf";


export default function ChatPage({chatHistory, setChatHistory}) {
  const inputRef = useRef();
  const fileInput = useRef();

  const openAIEnabled = useRef(false);
  const [msgInputValue, setMsgInputValue] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  //const [chatHistory, setChatHistory] = useState([]);
  //const [sendDisabled, setStateSendDisabled] = useState(true);
  const [attachText, setAttachText] = useState([]);
  const [attachState, setAttachState] = useState({
    count:0,
    icon: "paperClip"
  });

  useEffect(()=>{
      //console.log(attachText);
      setAttachState(prevState => ({ ...prevState, count: attachText.length, icon: "paperClip"}));
  },[attachText]);


  const messagesEndRef = useRef();
  
  useEffect(()=>{
    console.log(openAIEnabled.current);
    if(openAIEnabled.current){
      openAIEnabled.current = false;
      postOpenAIChatResponse(chatHistory, setChatHistory);
    }
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  },[chatHistory]);

  const handleSend = (message,c1,c2,c3) => {
    message = c2;

    if(!openAIEnabled.current){
      openAIEnabled.current = true;
      setChatHistory(prevChatHistory => [
        ...prevChatHistory,
        {
          content: message,
          role: 'user',
          attachments: attachText
        },
        {
          content: '',
          role: 'assistant'
        }
      ]);
      setMsgInputValue("");
      setAttachText([]);      
    }
    inputRef.current.focus();
  };

    const handleAttachClick = () => {
      //console.log(inputRef.current.attachButton.buttonA.button.children);
      setShowOverlay(!showOverlay);
    }
    const handlePDFClick = () => {
      fileInput.current.click();
    }

    const handleFileChange = event => {
        //setFiles([...files, ...event.target.files]);
        //console.log(event.target.files);
        extractPDFText(event.target.files).then((text) => setAttachText(text));
        setAttachState(prevState => ({ ...prevState, icon: "Loading"}));
        event.target.value = '';
    }
  
  return (
    <div className="mainChat">
            <MessageDisplay messages={chatHistory} messagesEndRef={messagesEndRef}/>
            <div as={MessageInput} className="messageInputDIV">
                <MessageInput ref={inputRef} onChange={msg => setMsgInputValue(msg)} value={msgInputValue} sendButton={true} attachButton={true} onSend={handleSend} onAttachClick={handleAttachClick} className="messageInput" attachState={attachState}/>
                <Overlay target={inputRef.current!==undefined?inputRef.current.attachButton.buttonA.button:inputRef} show={showOverlay} placement="top" rootClose onHide={() => setShowOverlay(false)}>
                  {({
                    placement: _placement,
                    arrowProps: _arrowProps,
                    show: _show,
                    popper: _popper,
                    hasDoneInitialMeasure: _hasDoneInitialMeasure,
                    ...props
                  }) => (
                    <div
                      {...props}
                      style={{
                        position: 'absolute',
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        padding: '2px 5px',
                        color: 'white',
                        borderRadius: 3,
                        ...props.style,
                      }}
                    >
                      <Stack direction="horizontal" gap={3}>
                          <FontAwesomeIcon className="fa-2x attachIcon" icon={faFilePdf} onClick={handlePDFClick}/>
                      </Stack>
                    </div>
                  )}
                </Overlay>                       
            </div>
            
            <div style={{display: 'none'}}>
                <input type="file" accept=".pdf" ref={fileInput} onChange={(e) => handleFileChange(e)} multiple></input>
            </div>
    </div>
  )
}