import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/chat.css';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import React, { useState, useEffect } from 'react';

import LeftSideNav from './components/LeftSideNav';
import RightSideNav from './components/RightSideNav';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ChatPage from './components/ChatPage';
import FavModal from './components/Modal/FavModal';


/* userObject //BrightSpace API whomai: {"Identifier":"1163","FirstName":"Zach","LastName":"Medendorp","Pronouns":null,"UniqueName":"zmedendorp@branksome.on.ca","ProfileIdentifier":"FhoF5s161j"}
    ID:
    firstName:
    lastName:
    email:
    roleID:
    favPrompts: [...promptIDs]
  */
 
 /*
const userObject = {
  ID: null,
  firstName: "",
  lastName: "",
  email: "",
  roleID: null,
  favPrompts: [],
};*/

function App() {
  const [showFav, setShowFav] = useState(false);


  useEffect(()=>{
    //if(!user.ID){
      //window.open("https://localhost:5000/login",'_blank');
      /*login().then((whoami) => {
        setUser({...user,
        ID: whoami.Identifier,
        firstName: whoami.FirstName,
        lastName: whoami.LastName,
        email: whoami.UniqueName,
        });
        console.log(whoami);
      }*/
    //}
  },[])

  const handleResponse = (responseData) => {
    //setPrompt(responseData);
    console.log(responseData);
  };

      return(
      <div className="App">      
        <Container>
          <LeftSideNav setShowFav={setShowFav}/>
          <Row>          
            <div>
              <ChatPage/>
            </div>
          </Row>
          <RightSideNav/>
        </Container>
        <FavModal showFav={showFav} setShowFav={setShowFav} handleResponse={handleResponse}/>                  
      </div>
      );
}

export default App;
