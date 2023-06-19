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
import Layout from './Components/Layout';

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
          <Route path="/home" element={<Layout showCreate={showCreate}><Home showCreate={showCreate} showAddModal={showAddModal}/></Layout>} />
          <Route path="/profile" element={<Layout showCreate={showCreate}><Profile /></Layout>} />
          <Route path="/createpost" element={<Layout showCreate={showCreate}><CreatePost /></Layout>} />
          <Route path="/notifications" element={<Layout showCreate={showCreate}><div></div></Layout>} />
          <Route path="/messages" element={<Layout showCreate={showCreate}></Layout>} />
          <Route path="/reels" element={<Layout showCreate={showCreate}></Layout>} />
          <Route path="/explore" element={<Layout showCreate={showCreate}></Layout>} />
          <Route path="/search" element={<Layout showCreate={showCreate}></Layout>} />
          <Route path="/tags" element={<Layout showCreate={showCreate}></Layout>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
