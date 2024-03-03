import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/chat.css';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { googleLogout } from '@react-oauth/google';
import { getUserByEmail } from "./scripts/mongo";

import LeftSideNav from './components/LeftSideNav';
import RightSideNav from './components/RightSideNav';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ChatPage from './components/ChatPage';
import FavModal from './components/Modal/FavModal';
import Signin from './components/Signin';
import ExcelReader from './components/ExcelReader';
import ReportAssistant from './components/ReportAssistant/ReportAssistant';


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
  picture: ""
};*/

function App() {
  const [showFav, setShowFav] = useState(false);

  const [ user, setUser ] = useState(null);
  const [ chatHistory, setChatHistory] = useState([]);
  const [selectedModel, setSelectedModel] = useState("GPT40");

 //Check if user has a persistent login in localStorage
  useEffect(() => {
    const persistentLogin = localStorage.getItem('userCredential');
    //console.log(jwt_decode(persistentLogin));
    if(persistentLogin){
      //getUser
      getUserByEmail(jwt_decode(persistentLogin).email).then((res)=>{
        setUser(res);
      }).catch((err)=>console.log(err));
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
        <div className="App">
          {!user ?
          <Signin setUser={setUser}/>
          :
          <Routes>
            <Route exact path="/" element={
              <>
              <Container>
              <LeftSideNav setShowFav={setShowFav} handleLogOut={handleLogOut} clearChat={clearChat}/>
              <Row>          
                <div>
                  <ChatPage chatHistory={chatHistory} setChatHistory={setChatHistory} selectedModel={selectedModel}/>
                </div>
              </Row>
              <RightSideNav selectedModel={selectedModel} setSelectedModel={setSelectedModel}/>
            </Container>
            <FavModal showFav={showFav} setShowFav={setShowFav} handleResponse={handleResponse} setUser={setUser} user={user}/> 
            </>
            } />
            <Route path="/ExcelReader" exact element= {<ExcelReader/>} />
            <Route path="/ReportAssistant" exact element= {<ReportAssistant user={user} setUser={setUser}/>} />
          </Routes>        
          }     
                           
        </div>
      );
}

export default App;
