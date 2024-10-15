import React from 'react';
import { Routes, Route } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './styles/chat.css';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import 'react-toastify/dist/ReactToastify.css';


import AppBB from './AppBB';
import AppMain from './AppMain';

function App() {
      return(
            <Routes>
              <Route exact path="/" element={<AppMain/>} /> {/* Main Chat Page */}
              <Route path="/BB" element={<AppBB/>} /> {/*Blackbaud SSO*/}
            </Routes>           
          );
}

export default App;
