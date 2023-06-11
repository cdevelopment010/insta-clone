import './Styles/variables.css';
import './Styles/main.css';

import {BrowserRouter, Routes, Route } from "react-router-dom"

import Post from "./Components/Post";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Avatar from "./Components/Avatar";

import Firebase from './Firebase.js';

function App() {
  return (
    <div className="container"  >
      <BrowserRouter basename={`${process.env.PUBLIC_URL}`}>{/*For live*/} 
      {/* <BrowserRouter> */}{/*For development*/} 

        <Routes >
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
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
