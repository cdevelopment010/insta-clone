
import { Link, useNavigate } from 'react-router-dom';

import Firebase from '../Firebase';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { addDoc, collection, serverTimestamp, updateDoc, doc, getDocs, query, where } from "firebase/firestore"
import '../Styles/login.css';
import '../Styles/emailSignUp.css';
import { useState, useEffect } from 'react';

export default function EmailSignUp() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const [fullName, setFullName] = useState(""); 
    const [username, setUsername] = useState(""); 
    const [imageNumber, setImageNumber] = useState(1);

    const userCollectionRef = collection(Firebase.db, 'users'); 
    const navigate = useNavigate(); 

    useEffect(() => {
        let interval = setInterval(() => {
            setImageNumber((imageNumber % 4) + 1)
        }, 3000); 
        return () => clearInterval(interval);
    },[])

    async function createUser(e) {
        
        let error = false;
        e.preventDefault(); 
        if(fullName.trim().length == 0){error=true; alert("Please provide a name")}
        if(username.trim().length == 0){error=true; alert("Please provide a username")}
        if(password.trim().length == 0){error=true; alert("Please provide a password")}
        if(email.trim().length == 0){error=true; alert("Please provide a email")}

        if(error) {return}


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
        <div className="sign-up-container d-flex flex-column align-items-center justify-content-evenly">
            
            <main className='d-flex align-items-center justify-content-center flex-grow mt-5'>
                {/* images */}
                <div className='phone-main' >
                    <img src={process.env.PUBLIC_URL + '/images/home-phones.png'} alt="" />
                    <img src={process.env.PUBLIC_URL + '/images/phone-image-' + imageNumber + '.png'} alt="" className='phone-image'/>
                </div>
                {/* Form */}
                <div className='d-flex flex-column  align-items-center justify-content-evenly flex-grow' style={{maxWidth: '350px'}}>
                    <div className="form-1 d-flex flex-column p-5 align-items-center justify-content-center border-1 w-100">
                        <div className='mb-5'>
                            <h1 className='text-center'>Instagram</h1>
                            <h3 className='text-center mt-2'>Sign up to see photos <s>and videos</s> from your friends.</h3>
                        </div>
                        <div className="form-container d-flex flex-column align-items-center justify-content-center mb-5">
                            <input type="email" placeholder="Email address" autoComplete='off' value={email} onChange={(e) => setEmail(e.target.value)}/>
                            <input type="text" placeholder="Full name" autoComplete='off'value={fullName} onChange={(e) => setFullName(e.target.value)}/>
                            <input type="text" placeholder="Username" autoComplete='off' value={username} onChange={(e) => setUsername(e.target.value)}/>
                            <input type="password" placeholder="Password" autoComplete='off' value={password} onChange={(e) => setPassword(e.target.value)}/>
                            <button onClick={createUser} type="button" className='mt-3 cursor-pointer'>Create User</button>
                        </div>
                        <div className='text-center'>
                            <span>Have an account?</span>
                            <Link to="/"><span>Log in</span></Link>
                        </div> 
                    </div>
                </div>
            </main>
            {/* <div>
                <button onClick={logout}>Log out</button>
            </div> */}
            
            <footer style={{height: '90px'}}>
            </footer>
        </div>
    )
}