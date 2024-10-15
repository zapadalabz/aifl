import React, { useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";
import { googleLogout } from '@react-oauth/google';
import { getUserByEmail } from "./scripts/mongo";
import { ToastContainer, toast } from 'react-toastify';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './styles/chat.css';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import 'react-toastify/dist/ReactToastify.css';

import LeftSideNav from './components/LeftSideNav';
import RightSideNav from './components/RightSideNav';
import ChatPage from './components/ChatPage';
import FavModal from './components/Modal/FavModal';
import Signin from './components/Signin';


/* userObject //BrightSpace API whomai: {"Identifier":"1163","FirstName":"Zach","LastName":"Medendorp","Pronouns":null,"UniqueName":"zmedendorp@branksome.on.ca","ProfileIdentifier":"FhoF5s161j"}
    ID:
    firstName:
    lastName:
    email:
    roleID:
    favPrompts: [...promptIDs]
    managebacID:
  */
 
 //with Google login
 /*
const userObject = {
  firstName: "",
  lastName: "",
  email: "",
  favPrompts: [],
  picture: "",
  role: "",
  managebacID: ""
};*/

function AppMain() {
  const [showFav, setShowFav] = useState(false);

  const [ user, setUser ] = useState(null);
  const [ chatHistory, setChatHistory] = useState([]);
  const [selectedModel, setSelectedModel] = useState("GPT4o");

  const [deviceType, setDeviceType] = useState(null);

  useEffect(() => {
    const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    setDeviceType(mobile ? "Mobile" : "Desktop");
  }, []);

 //Check if user has a persistent login in localStorage
 useEffect(() => {  
  const persistentLogin = localStorage.getItem('userCredential');

  if(persistentLogin){
      try {
          const decodedToken = jwt_decode(persistentLogin);
          if(decodedToken?.email) {
              getUserByEmail(decodedToken.email).then((res)=>{
                //console.log(res);
                if(res.email){
                  setUser(res);
                }else{
                  handleLogOut();
                }
              }).catch((err)=>{
                  toast.error(err.toString());
              });
          } else {
              toast.error("Invalid token, no email found.");
          }
      } catch(error) {
          toast.error("Failed to decode the token.");
      }
  }
},[]);

  const handleLogOut = () => {
    console.log("here");
    googleLogout();
    setUser(null);
    localStorage.removeItem('userCredential');
    console.log("logged Out");
  };

  const handleResponse = (responseData) => {
    //setPrompt(responseData);
    console.log(responseData);
  };

  const clearChat = () => {
    setChatHistory([]);
  }

      return(
        deviceType === "Mobile" 
        ? <h1>Mobile Version is Not Coming Soon</h1>
        :
          <div className="App">
            <ToastContainer/>
            {!user ?
            <Signin setUser={setUser}/>
            :
              <>
                <Container>
                  <LeftSideNav setShowFav={setShowFav} handleLogOut={handleLogOut} clearChat={clearChat}/>
                  <Row>          
                    <div>
                      <ChatPage chatHistory={chatHistory} setChatHistory={setChatHistory} selectedModel={selectedModel} token={user.token}/>
                    </div>
                  </Row>
                  <RightSideNav selectedModel={selectedModel} setSelectedModel={setSelectedModel}/>
                </Container>
                <FavModal showFav={showFav} setShowFav={setShowFav} handleResponse={handleResponse} setUser={setUser} user={user}/> 
              </>           
            }                   
          </div>
          );
}

export default AppMain;
