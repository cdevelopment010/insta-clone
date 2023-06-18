
import { Link, useNavigate } from 'react-router-dom';

import Firebase from '../Firebase';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { addDoc, collection, serverTimestamp, updateDoc, doc, getDocs, query, where } from "firebase/firestore"
import '../Styles/login.css';
import { useState } from 'react';

export default function EmailSignUp() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const [fullName, setFullName] = useState(""); 
    const [username, setUsername] = useState(""); 

    const userCollectionRef = collection(Firebase.db, 'users'); 
    const navigate = useNavigate(); 

    async function createUser(e) {

        e.preventDefault(); 
        try {
            await createUserWithEmailAndPassword(Firebase.auth, email, password);
            await newUserCheck(); 
        } catch (error) {
            console.error(error);
        }
    }

    const logout = async () => {
        
        try {
            await signOut(Firebase.auth);
            console.log("Signed out");
        } catch (error) {
            console.error(error);
        }
    }

    const newUserCheck = async () => {
        try {
            let authUid = Firebase?.auth?.currentUser?.uid || null;
            const userData = query(userCollectionRef, where("userid", "==", authUid));
            const querySnapshop = await getDocs(userData);

            if (querySnapshop.size > 0 ) {
                querySnapshop.forEach(async (doc) => {
                    const data = {...doc.data(), id: doc.id};
                    await updateDoc(doc(userCollectionRef, data.id), {
                        lastLoggedIn: serverTimestamp()
                    })
                })

                navigate("/home");
            } else {
                await addDoc(userCollectionRef, {
                    userid: Firebase.auth.currentUser.uid,
                    profileImgUrl: null,
                    fullName: fullName,
                    username: username,
                    created: serverTimestamp(),
                    lastLoggedIn: serverTimestamp()
                })
                navigate("/profile");
            }
            
        } catch(error) {
            console.error(error)
        }
    }


    return (
        <div className="sign-up-container d-flex flex-column align-items-center justify-content-even">
            <div>
                <div>
                    <h1 className='text-center'>Instagram</h1>
                    <h3>Sign up to see photos and <s>videos</s> from your friends.</h3>
                </div>
                <div className="form-container d-flex flex-column align-items-center justify-content-center">
                    <input type="email" placeholder="Email address" autoComplete='off' value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type="text" placeholder="Full name" autoComplete='off'value={fullName} onChange={(e) => setFullName(e.target.value)}/>
                    <input type="text" placeholder="Username" autoComplete='off' value={username} onChange={(e) => setUsername(e.target.value)}/>
                    <input type="password" placeholder="Password" autoComplete='off' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <button onClick={createUser} type="button">Create User</button>
                </div>
            </div>
            <div>
                <span>Have an account?</span>
                <Link to="/"><span>Log in</span></Link>
            </div>
            <div>
                {/* Just for testing */}
                <button onClick={logout}>Log out</button>
            </div>
        </div>
    )
}