import './Styles/variables.css';
import './Styles/main.css';

import {BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./Components/Login";
import Home from "./Components/Home";
import EmailSignUp from './Components/EmailSignUp';
import CreatePost from './Components/CreatePost';
import Profile from './Components/Profile';

function App() {
  return (
    <div className="container"  >
      <BrowserRouter basename={`${process.env.PUBLIC_URL}`}>{/*For live*/} 
      {/* <BrowserRouter> */}{/*For development*/} 

        <Routes >
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/emailsignup" element={<EmailSignUp />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
