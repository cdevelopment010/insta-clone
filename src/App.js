import './Styles/variables.css';
import './Styles/main.css';

import {BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./Components/Login";
import Home from "./Components/Home";
import EmailSignUp from './Components/EmailSignUp';
import Firebase from './Firebase.js';
import CreatePost from './Components/CreatePost';

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
        </Routes>
      </BrowserRouter>
      {/* <Login /> */}
      {/* <Home /> */}
      {/* <Avatar size="md" bg="bg" src="" className="" /> */}
      {/* <Post /> */}
    </div>
  );
}

export default App;
