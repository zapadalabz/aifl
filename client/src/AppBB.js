import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import './AppBB.css';

import ChatPageBB from './components/ChatPageBB';
import EditComments from './components/EditComments';
import FloatingMenu from './components/FloatingMenu';

import { getBBUser, getStatus, BB_Login, BB_Logout, getTeacherSections } from './scripts/bb-sso';
import { getUserByID, updateBBUser } from "./scripts/mongo";

function AppBB() {
  const [view, setView] = useState("Chat");
  const [deviceType, setDeviceType] = useState(null);
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [authMsg, setAuthMsg] = useState("Authenticating...");
  const [ chatHistory, setChatHistory] = useState([]);
  const [ selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const location = useLocation();

  useEffect(() => {
    const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    setDeviceType(mobile ? "Mobile" : "Desktop");
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const ssoToken = queryParams.get('sso_token');
        if (!ssoToken) {
          setAuthMsg('No token provided');
          return;
        }

        const response = await getStatus(ssoToken);
        if (!response) {
          setAuthMsg('Authentication failed: Invalid token');
          return;
        }

        const userID = response.uid;
        const userRes = await getUserByID(userID);
        const token = userRes.token;

        if ('role' in userRes) {
          setUser(userRes);
          setAuthenticated(true);
          if (userRes.role === "Staff") {
            setView("Edit Comments");
          }
        } else {
          setAuthMsg('Initializing...Please Wait');
          const bbLoginRes = await BB_Login();
          const BB_Token = bbLoginRes.Token;

          const bbUserRes = await getBBUser(userID, BB_Token);
          const role = bbUserRes.StudentId === "" ? (bbUserRes.ParentId === null ? "Staff" : "Parent") : "Student";

          const BB_User = {
            userID: userID,
            FirstName: bbUserRes.FirstName,
            LastName: bbUserRes.LastName,
            role: role,
          };

          if (role === "Staff") {
            const teacherSectionsRes = await getTeacherSections(userID, BB_Token);
            const sections = {};
            for (let i = 0; i < teacherSectionsRes.length; i++) {
              if (teacherSectionsRes[i].Id === teacherSectionsRes[i].LeadSectionId) {
                sections[teacherSectionsRes[i].Id] = teacherSectionsRes[i].Name;
              }
            }
            BB_User.sections = sections;
          }
          await updateBBUser(BB_User);
          setUser({ ...BB_User, token: token });
          await BB_Logout(BB_Token);
          setAuthenticated(true);
          setView("Edit Comments");
        }
      } catch (error) {
        console.error('Error during authentication:', error);
        setAuthMsg('Authentication failed: Server error');
      }
    };

    fetchUserData();
  }, [location]);


  if(authenticated){
    return (
      <div className='App'>
        {user.role === "Staff1" ? <FloatingMenu menuItems={{"Edit Comments":"Edit", "Chat":"Chat"}}  setView={setView} /> : null}
        {view === "Chat" && <ChatPageBB chatHistory={chatHistory} setChatHistory={setChatHistory} selectedModel={selectedModel} token={user.token} user={user}/>}
        {view === "Edit Comments" && <EditComments token={user.token}/>}
      </div>
    );
  } 

  return (
    <div className='App'>
      <h1>{authMsg}</h1>
    </div>
  );

}

export default AppBB;