import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareFacebook } from '@fortawesome/free-brands-svg-icons';
import '../Styles/login.css';

export default function Login() {

    const [imageNumber, setImageNumber] = useState(1);

    useEffect(() => {
        let interval = setInterval(() => {
            setImageNumber((imageNumber % 4) + 1)
            console.log(imageNumber);
        }, 3000); 

        return () => clearInterval(interval);
    })

    return (
        <div className="login-container">
            <main className='d-flex align-items-center justify-content-center flex-grow mt-5'>
                {/* images */}
                <div className='phone-main' >
                    <img src={process.env.PUBLIC_URL + '/images/home-phones.png'} alt="" />
                    <img src={process.env.PUBLIC_URL + '/images/phone-image-' + imageNumber + '.png'} alt="" className='phone-image'/>
                </div>
                
                {/* Form section */}
                    <div className='d-flex flex-column  align-items-center justify-content-evenly flex-grow' style={{maxWidth: '350px'}}>
                        <div className="form-1 d-flex flex-column p-5 align-items-center justify-content-center border-1 w-100">
                            <h1 className='m-5'>Instagram</h1>
                            <div className='mt-5 mb-5 ms-5 me-5 w-100'>
                                <form className='d-flex flex-column justify-content-evenly'>
                                    <input type="text" placeholder='Phone number, username or email address' className='w-100' />
                                    <input type="password" placeholder='Password' className='w-100'/>
                                    <Link to="/home"><button type="button" className='w-100 mt-2 cursor-pointer'>Login</button></Link>
                                </form>
                            </div>
                            <div className='or'>OR</div>
                            <div className='mt-3 facebook-login d-flex align-item-center'>
                               <FontAwesomeIcon icon={faSquareFacebook} className='facebook-icon me-1'/> Log in with Facebook
                            </div>
                            <div className='mt-3 forgotten-password'>
                                Forgotten your password?
                            </div>
                        </div>
                        <div className="sign-up-form border-1 mt-3 p-5 w-100 d-flex align-item-center justify-content-center">
                            <span>Don't have an account? </span>
                            <span className='sign-up ms-1'>Sign up</span>
                        </div>

                        <div className='mt-3 d-flex flex-column align-item-center justify-content-center download-app'>
                            <span className='mb-3'>Get the app.</span>
                            <div className='d-flex'>
                                <img src={process.env.PUBLIC_URL + '/images/google-play.png'} alt="" style={{height: '40px'}} className='me-3'/>
                                <img src={process.env.PUBLIC_URL + '/images/microsoft.png'} alt="" style={{height: '40px'}}/>
                                {/* image Microsoft */}
                            </div>
                        </div>
                    </div>

            </main>
            <footer className='mb-5'>
                <ul className='d-flex justify-content-evenly align-items-center m-3'>
                    <li>Meta</li>
                    <li>About</li>
                    <li>Blog</li>
                    <li>Jobs</li>
                    <li>Help</li>
                    <li>API</li>
                    <li>Privacy</li>
                    <li>Terms</li>
                    <li>Top accounts</li>
                    <li>Locations</li>
                    <li>Instagram Lite</li>
                    <li>Contact uploading and non-users</li>
                    <li>Meta Verified</li>
                </ul>
                <ul className='d-flex align-items-center justify-content-center m-3'>
                    <li className='me-3'>English (UK)</li>
                    <li>&copy; {new Date().getFullYear()} Instagram Clone From The Odin Project</li>
                </ul>
            </footer>
        </div>
    )
}