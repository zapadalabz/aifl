import React, {useState, useRef, useEffect, useContext} from "react";
//import { MessageInput} from "@chatscope/chat-ui-kit-react";
import { postOpenAIChatResponse, postOpenAIChatResponseAzureSearch } from "../scripts/openAI";
import MessageDisplay from "./Message/MessageDisplay";
import { processFiles } from "../scripts/processFile";
import MessageInput from "./Message/MessageInput/MessageInput";
import Overlay from 'react-bootstrap/Overlay';
import Stack from 'react-bootstrap/Stack';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-regular-svg-icons/faFileLines";
import { faImage } from "@fortawesome/free-regular-svg-icons/faImage";
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ChatPage({chatHistory, setChatHistory, selectedModel, token}) {
  const params = useParams();
  const searchIndex = params.searchIndex||"";

  const inputRef = useRef();
  const fileInput = useRef();
  const imgInput = useRef();

  const openAIEnabled = useRef(false);
  const [chatSettings, setChatSettings] = useState({system_message:"You are an experienced teacher that responds using Markdown.",temperature:0.7});
  const [msgInputValue, setMsgInputValue] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const [attachText, setAttachText] = useState([]);
  const [imageBase64, setImageBase64] = useState('');
  const [attachState, setAttachState] = useState({
    count:0,
    icon: "paperClip"
  });

  useEffect(()=>{
    const localChatSettings = localStorage.getItem('chatSettings');

    if(localChatSettings){
      const local_settings = JSON.parse(localChatSettings);
      if (local_settings.system_message === ""){
        setChatSettings({...local_settings, "system_message":"You are an experienced teacher who loves helping out."});
      }else{
        setChatSettings(local_settings);
      }      
    }
  },[]);

  useEffect(()=>{
      //console.log(attachText);
      setAttachState(prevState => ({ ...prevState, count: attachText.length, icon: "paperClip"}));
  },[attachText]);

  const onPaste = (event) => {
    const clipboardData = event.clipboardData;
    const items = clipboardData.items;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        const reader = new FileReader();

        reader.onload = (event) => {
          setImageBase64(event.target.result);
          //console.log(event.target.result);
        };
        reader.readAsDataURL(file);
      } else if (item.type === 'text/plain') {
        item.getAsString((text) => {
          document.execCommand('insertText', false, text);
        });
      }
    }

    event.preventDefault(); // Prevent the default paste behavior
  };

  const messagesEndRef = useRef();
  
  useEffect(()=>{
    //console.log(openAIEnabled.current);
    if(openAIEnabled.current){
      openAIEnabled.current = false;
      setIsThinking(true);
      if(searchIndex!==""){
        postOpenAIChatResponseAzureSearch(chatHistory, setChatHistory, selectedModel, token, searchIndex, setIsThinking);
      }else{
        postOpenAIChatResponse(chatHistory, setChatHistory, selectedModel, token, chatSettings, setIsThinking);
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
          attachments: attachText,
          img: imageBase64
        },
        {
          content: '',
          role: 'assistant'
        }
      ]);
      setMsgInputValue("");
      setAttachText([]);  
      setImageBase64('');    
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
        processFiles(event.target.files).then((text) => setAttachText(text))
        .catch((err) => console.log(err));
        setAttachState(prevState => ({ ...prevState, icon: "Loading"}));
        event.target.value = '';
    }
  const handleImgClick = () => {
    setImageBase64('');
  }
  const handleImgIconClick = () => {
    imgInput.current.click();
  }

  const handleImageChange = event => {
    const file = event.target.files[0];
    
    // Check if the file exists and is less than 4MB
    if (file && file.size < 4 * 1024 * 1024) { // 4MB in bytes
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageBase64(event.target.result);
        //console.log(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("File is too large or not available. Max 4Mb allowed.");
    }
    
    event.target.value = '';
  }

  return (
    <div className="mainChat">
            <MessageDisplay messages={chatHistory} messagesEndRef={messagesEndRef} chatSettings={chatSettings} setChatSettings={setChatSettings} isThinking={isThinking}/>
            <div as={MessageInput} className="messageInputDIV">
                <MessageInput ref={inputRef} onPaste={onPaste} onChange={msg => setMsgInputValue(msg)} value={msgInputValue} sendButton={true} attachButton={searchIndex===""?true:false} onSend={handleSend} onAttachClick={handleAttachClick} className="messageInput" attachState={attachState}/>
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
                          <FontAwesomeIcon className="fa-2x attachIcon" icon={faFileLines} onClick={handlePDFClick}/>
                          <FontAwesomeIcon className="fa-2x attachIcon" icon={faImage} onClick={handleImgIconClick}/>
                      </Stack>
                    </div>
                  )}
                </Overlay>
                <Overlay target={inputRef.current!==undefined&&searchIndex===""?inputRef.current.attachButton.buttonA.button:inputRef} show={imageBase64 !== ''} placement="top" rootClose onHide={() => setShowOverlay(false)}>
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
                      <img src={imageBase64} alt="Pasted" style={{maxWidth: '200px', maxHeight: '200px'}} onClick={() => handleImgClick()}/>
                    </div>
                  )}
                </Overlay>
            </div>
            
            <div style={{display: 'none'}}>
                <input type="file" accept=".pdf, .docx" ref={fileInput} onChange={(e) => handleFileChange(e)} multiple></input>
            </div>
            <div style={{display: 'none'}}>
                <input type="file" accept="image/*" ref={imgInput} onChange={(e) => handleImageChange(e)}></input>
            </div>
    </div>
  )
}