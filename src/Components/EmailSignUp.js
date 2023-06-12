
import { Link } from 'react-router-dom';

import Firebase from '../Firebase';
import '../Styles/login.css';

export default function EmailSignUp() {

    async function createUser(e) {

        e.preventDefault(); 
        let email = document.getElementById("email");
        let password = document.getElementById("password");
        await Firebase.newUserSignInEmail(email, password);
        console.log("New user created.")
    }

    return (
        <div className="sign-up-container d-flex flex-column align-items-center justify-content-even">
            <div>
                <div>
                    <h1 className='text-center'>Instagram</h1>
                    <h3>Sign up to see photos and <s>videos</s> from your friends.</h3>
                </div>
                <div className="form-container d-flex flex-column align-items-center justify-content-center">
                    <input type="email" placeholder="Email address" id="email" autoComplete='off'/>
                    <input type="text" placeholder="Full name" id="name" autoComplete='off'/>
                    <input type="text" placeholder="Username" id="username" autoComplete='off'/>
                    <input type="password" placeholder="Password" id="password" autoComplete='off'/>
                    <button onClick={createUser} type="button">Create User</button>
                </div>
            </div>
            <div>
                <span>Have an account?</span>
                <Link to="/"><span>Log in</span></Link>
            </div>
        </div>
    )
}