import React, {useState, useRef, useEffect, useContext} from "react";
//import { MessageInput} from "@chatscope/chat-ui-kit-react";
import { postOpenAIChatResponse, postOpenAIChatResponseAzureSearch } from "../scripts/openAI";
import MessageDisplay from "./Message/MessageDisplay";
import { extractPDFText } from "../scripts/processFile";
import MessageInput from "./Message/MessageInput/MessageInput";
import Overlay from 'react-bootstrap/Overlay';
import Stack from 'react-bootstrap/Stack';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons/faFilePdf";
import { useParams } from 'react-router-dom';

export default function ChatPage({chatHistory, setChatHistory, selectedModel, token}) {
  const params = useParams();
  const searchIndex = params.searchIndex||"";

  const inputRef = useRef();
  const fileInput = useRef();

  const openAIEnabled = useRef(false);
  const [msgInputValue, setMsgInputValue] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);

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
    //console.log(openAIEnabled.current);
    if(openAIEnabled.current){
      openAIEnabled.current = false;
      if(searchIndex!==""){
        postOpenAIChatResponseAzureSearch(chatHistory, setChatHistory, selectedModel, token, searchIndex);
      }else{
        postOpenAIChatResponse(chatHistory, setChatHistory, selectedModel, token);
      }
      
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
        extractPDFText(event.target.files).then((text) => setAttachText(text))
        .catch((err) => console.log(err));
        setAttachState(prevState => ({ ...prevState, icon: "Loading"}));
        event.target.value = '';
    }
  
  return (
    <div className="mainChat">
            <MessageDisplay messages={chatHistory} messagesEndRef={messagesEndRef}/>
            <div as={MessageInput} className="messageInputDIV">
                <MessageInput ref={inputRef} onChange={msg => setMsgInputValue(msg)} value={msgInputValue} sendButton={true} attachButton={searchIndex===""?true:false} onSend={handleSend} onAttachClick={handleAttachClick} className="messageInput" attachState={attachState}/>
                <Overlay target={inputRef.current!==undefined&&searchIndex===""?inputRef.current.attachButton.buttonA.button:inputRef} show={showOverlay} placement="top" rootClose onHide={() => setShowOverlay(false)}>
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
                        backgroundColor: 'rgba(0, 0, 0, 0.0)',
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