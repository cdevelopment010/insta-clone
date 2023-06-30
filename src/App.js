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

function App() {

    const [currentUser, setCurrentUser] = useState(null); 
    const userCollectionRef = collection(Firebase.db, "users");
    
    useEffect(() => {
        const getCurrentUser = async () => {
            let authUid = Firebase?.auth?.currentUser?.uid || null;
            const userData = query(userCollectionRef, where("userid", "==", authUid));
            const querySnapshop = await getDocs(userData);
            querySnapshop.forEach((doc) => {
                const data = {...doc.data(), id: doc.id};
                setCurrentUser(data); 
            })
            // await updatePostsWithSearchString(); 
        }
        const unsubscribe = onAuthStateChanged(Firebase.auth, (userAuth) => {
            if (userAuth && userAuth.uid !== currentUser?.userid) {
                getCurrentUser(); 
            } else {
                
            }
        });
        return () => unsubscribe()

    }, [])
    const [showAddModal, setShowAddModal] = useState(false);

  const showCreate = () => {
      setShowAddModal(!showAddModal);
  }

  //run this once for all current posts
  // const updatePostsWithSearchString = async () => {
  //   console.log("updateposts...");
  //   let postsCollectionRef = collection(Firebase.db, "posts"); 
  //   const querySnapshot = await getDocs(postsCollectionRef);
  //   querySnapshot.forEach((d) => {
  //     const data = d.data(); 
  //     const description = data.description + " " + (data?.username ? data.username : ""); 
  //     const searchString = description.toLowerCase().split(/\s|#/);

  //     const docRef = doc(postsCollectionRef, d.id);
  //     updateDoc(docRef, { searchString });
  //   })

  // }

  return (
    <div className="container"  >
      <BrowserRouter basename={`${process.env.PUBLIC_URL}`}>{/*For live*/} 
      {/* <BrowserRouter> */}{/*For development*/} 

        <Routes >
          <Route path="/" element={<Login />} />
          <Route path="/emailsignup" element={<EmailSignUp />} />
          <Route path="/home" element={<Layout showCreate={showCreate}  currentUser={currentUser}><Home showCreate={showCreate} showAddModal={showAddModal} currentUser={currentUser}/></Layout>} />
          <Route path="/profile" element={<Layout showCreate={showCreate}  currentUser={currentUser}><Profile currentUser={currentUser} /></Layout>} />
          <Route path="/profile/:userid" element={<Layout showCreate={showCreate}  currentUser={currentUser}><Profile currentUser={currentUser} /></Layout>} />
          <Route path="/createpost" element={<Layout showCreate={showCreate}  currentUser={currentUser}><CreatePost currentUser={currentUser} /></Layout>} />
          <Route path="/notifications" element={<Layout showCreate={showCreate}  currentUser={currentUser}><div></div></Layout>} />
          <Route path="/messages" element={<Layout showCreate={showCreate}  currentUser={currentUser}></Layout>} />
          <Route path="/reels" element={<Layout showCreate={showCreate}  currentUser={currentUser}></Layout>} />
          <Route path="/explore" element={<Layout showCreate={showCreate}  currentUser={currentUser}></Layout>} />
          <Route path="/search/:searchstring" element={<Layout showCreate={showCreate}  currentUser={currentUser}><Search /></Layout>} />
          <Route path="/search/" element={<Layout showCreate={showCreate}  currentUser={currentUser}><Search /></Layout>} />
          <Route path="/tags" element={<Layout showCreate={showCreate}  currentUser={currentUser}></Layout>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
