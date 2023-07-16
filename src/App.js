import './Styles/variables.css';
import './Styles/main.css';

import {BrowserRouter, Routes, Route } from "react-router-dom"
import { useState, useEffect } from 'react';

import Login from "./Components/Login";
import Home from "./Components/Home";
import EmailSignUp from './Components/EmailSignUp';
import CreatePost from './Components/CreatePost';
import Profile from './Components/Profile';
import Layout from './Components/Layout';
import Search from './Components/Search';

import Firebase from './Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { query, where, getDocs, collection, updateDoc, doc } from 'firebase/firestore';
import EnlargedPost from './Components/EnglargedPost';

function App() {

    const [currentUser, setCurrentUser] = useState(null); 
    const userCollectionRef = collection(Firebase.db, "users");
    const [showAddModal, setShowAddModal] = useState(false);
    const [toastType, setToastType] = useState("warning");
    const [toastTimeout, setToastTimeout] = useState(1000);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVisible, setToastVisible] = useState(false);
    const [toast, setToast] = useState({});

    useEffect(() => {
        const getCurrentUser = async () => {
            let authUid = Firebase?.auth?.currentUser?.uid || null;
            const userData = query(userCollectionRef, where("userid", "==", authUid));
            const querySnapshop = await getDocs(userData);
            querySnapshop.forEach((doc) => {
                const data = {...doc.data(), id: doc.id};
                setCurrentUser(data); 
            })
        }
        const unsubscribe = onAuthStateChanged(Firebase.auth, (userAuth) => {
            if (userAuth && userAuth.uid !== currentUser?.userid) {
                getCurrentUser(); 
            } else {
                
            }
        });
        return () => unsubscribe()

    }, [])

    useEffect(()=> {

    },[toast])
    
  useEffect(() => {
    setToast({type: toastType
              , timeout: toastTimeout
              , message: toastMessage
              , visible: toastVisible
              , updateType: updateToastType
              , updateTimeout: updateToastTimeout
              , updateMessage: updateToastMessage
              , updateVisible: updateToastVisible
            })
  },[toastMessage, toastTimeout, toastType, toastVisible])

  const showCreate = () => {
      setShowAddModal(!showAddModal);
  }

  const updateToastType = (type) => {
    setToastType(type);
  }
  const updateToastTimeout = (timeout) => {
    setToastTimeout(timeout);
  }
  const updateToastMessage = (message) => {
    setToastMessage(message);
  }
  const updateToastVisible = () => {
    setToastVisible(!toastVisible);
  }

  return (
    <div className="container"  >
      <BrowserRouter basename={`${process.env.PUBLIC_URL}`}>
        <Routes >
          <Route path="/" element={<Login />} />
          <Route path="/emailsignup" element={<EmailSignUp />} />
          <Route path="/home" element={<Layout showCreate={showCreate}  currentUser={currentUser} toast={toast}><Home showCreate={showCreate} showAddModal={showAddModal} currentUser={currentUser} toast={toast}/></Layout>} />
          <Route path="/profile" element={<Layout showCreate={showCreate}  currentUser={currentUser} toast={toast}><Profile currentUser={currentUser} toast={toast}/></Layout>} />
          <Route path="/profile/:userid" element={<Layout showCreate={showCreate}  currentUser={currentUser} toast={toast}><Profile currentUser={currentUser} toast={toast}/></Layout>} />
          <Route path="/createpost" element={<Layout showCreate={showCreate}  currentUser={currentUser} toast={toast}><CreatePost currentUser={currentUser} toast={toast}/></Layout>} />
          <Route path="/notifications" element={<Layout showCreate={showCreate}  currentUser={currentUser} toast={toast}><div></div></Layout>} />
          <Route path="/messages" element={<Layout showCreate={showCreate}  currentUser={currentUser} toast={toast}></Layout>} />
          <Route path="/reels" element={<Layout showCreate={showCreate}  currentUser={currentUser} toast={toast}></Layout>} />
          <Route path="/explore" element={<Layout showCreate={showCreate}  currentUser={currentUser} toast={toast}></Layout>} />
          <Route path="/search/:searchstring" element={<Layout showCreate={showCreate}  currentUser={currentUser} toast={toast}><Search /></Layout>} />
          <Route path="/search/" element={<Layout showCreate={showCreate}  currentUser={currentUser} toast={toast}><Search /></Layout>} />
          <Route path="/post/:postid" element={<Layout showCreate={showCreate}  currentUser={currentUser} toast={toast}><EnlargedPost  currentUser={currentUser}/></Layout>} />
          <Route path="/tags" element={<Layout showCreate={showCreate}  currentUser={currentUser} toast={toast}></Layout>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
