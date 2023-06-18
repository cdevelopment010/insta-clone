import './Styles/variables.css';
import './Styles/main.css';

import {BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from 'react';

import Login from "./Components/Login";
import Menu from './Components/Menu';
import Home from "./Components/Home";
import EmailSignUp from './Components/EmailSignUp';
import CreatePost from './Components/CreatePost';
import Profile from './Components/Profile';

function App() {


  const [showAddModal, setShowAddModal] = useState(false);

  const showCreate = () => {
      setShowAddModal(!showAddModal);
  }
  return (
    <div className="container"  >
      <BrowserRouter basename={`${process.env.PUBLIC_URL}`}>{/*For live*/} 
      {/* <BrowserRouter> */}{/*For development*/} 

        <Routes >
          <Route path="/" element={<Login />} />
          <Route path="/emailsignup" element={<EmailSignUp />} />
        </Routes>

          <Menu showCreate={showCreate}>
            <Routes>
              <Route path="/home" element={<Home showCreate={showCreate} showAddModal={showAddModal}/>} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/createpost" element={<CreatePost />} />

            </Routes>
          </Menu>
      </BrowserRouter>
    </div>
  );
}

export default App;
