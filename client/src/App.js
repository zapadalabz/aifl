import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/chat.css';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import React, { useState, useEffect, useReducer } from 'react';
import { Routes, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { googleLogout } from '@react-oauth/google';
import { getUserByEmail, upsertUser } from "./scripts/mongo";
import { getUserRole } from "./scripts/managebac";

import LeftSideNav from './components/LeftSideNav';
import RightSideNav from './components/RightSideNav';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ChatPage from './components/ChatPage';
import FavModal from './components/Modal/FavModal';
import Signin from './components/Signin';
import ExcelReader from './components/ExcelReader';
import ReportAssistant from './components/ReportAssistant/ReportAssistant';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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

function App() {

  const [showFav, setShowFav] = useState(false);

  const [ user, setUser ] = useState(null);
  const [ chatHistory, setChatHistory] = useState([]);
  const [selectedModel, setSelectedModel] = useState("GPT40");

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
          if(decodedToken && decodedToken.email) {
              getUserByEmail(decodedToken.email).then((res)=>{
                //console.log(res);
                if(res.role){
                  setUser(res);
                }else{
                  getUserRole(res.email).then((role)=>{
                    res.role = role;
                    setUser(res);
                    upsertUser(res).then((res)=>{
                      console.log(res);
                    });
                  }).catch((err)=>{
                    toast.error(err.toString());
                  });
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
        ? <h1>Mobile Version Coming Soon</h1>
        :
          <div className="App">
            <ToastContainer/>
            {!user ?
            <Signin setUser={setUser}/>
            :
              <>
              {user.role === "Staff"?
              <Routes>
                <Route exact path="/" element={
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
                } />
                <Route path="/ExcelReader" exact element= {<ExcelReader/>} />
                <Route path="/ReportAssistant" exact element= {<ReportAssistant user={user} setUser={setUser}/>} />
                <Route path="/:searchIndex" element={
                <>
                  <Container>
                    <ChatPage chatHistory={chatHistory} setChatHistory={setChatHistory} selectedModel={selectedModel} token={user.token}/>
                  </Container>
                </>
                } />
              </Routes>
              ://Student Routes
              <Routes>
                <Route path="/:searchIndex" element={
                <>
                  <Container>
                    <ChatPage chatHistory={chatHistory} setChatHistory={setChatHistory} selectedModel={selectedModel} token={user.token}/>
                  </Container>
                </>
                } />
                <Route path="/" element={
                <>
                  <Container>
                    Search Index Required
                  </Container>
                </>
                } />
              </Routes>  
              }
              </>              
            }                   
          </div>
          );
}

export default App;
