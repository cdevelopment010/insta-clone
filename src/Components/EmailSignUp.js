
import { Link } from 'react-router-dom';

import Firebase from '../Firebase';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import '../Styles/login.css';
import { useState } from 'react';

export default function EmailSignUp() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 

    console.log(Firebase.auth?.currentUser?.email);

    async function createUser(e) {

        e.preventDefault(); 
        try {
            await createUserWithEmailAndPassword(Firebase.auth, email, password);
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


    return (
        <div className="sign-up-container d-flex flex-column align-items-center justify-content-even">
            <div>
                <div>
                    <h1 className='text-center'>Instagram</h1>
                    <h3>Sign up to see photos and <s>videos</s> from your friends.</h3>
                </div>
                <div className="form-container d-flex flex-column align-items-center justify-content-center">
                    <input type="email" placeholder="Email address" id="email" autoComplete='off'onChange={(e) => setEmail(e.target.value)}/>
                    <input type="text" placeholder="Full name" id="name" autoComplete='off'/>
                    <input type="text" placeholder="Username" id="username" autoComplete='off'/>
                    <input type="password" placeholder="Password" id="password" autoComplete='off' onChange={(e) => setPassword(e.target.value)}/>
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