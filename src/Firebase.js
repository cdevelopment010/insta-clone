// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, 
        onAuthStateChanged, 
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        GoogleAuthProvider,
        signInWithPopup   } from "firebase/auth";
import {getFirestore, collection} from 'firebase/firestore'


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxZFKpxvpclcktluR7brgYu1F19f5lJtk",
  authDomain: "insta-cl-75d34.firebaseapp.com",
  projectId: "insta-cl-75d34",
  storageBucket: "insta-cl-75d34.appspot.com",
  messagingSenderId: "164728955690",
  appId: "1:164728955690:web:533e43e6217fd1cf6a3453",
  measurementId: "G-ZW0L1S0W7K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const usersCol = collection(db, 'users'); 
const postsCol = collection(db, 'posts'); 


/******************************************/
//Authentication 
/******************************************/
const auth = getAuth(app);
let gUser = auth.currentUser; 
// new user - email and password auth
async function newUserSignInEmail(email, password) {
  await createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
  })
  .catch((error) => {
    const errorCode = error.code; 
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);
  })
}
//Exisiting user - email and password
async function signInExisitingEmail(email, password) {
  await signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
  })
  .catch((error) => {
    const errorCode = error.code; 
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);
  })
}

//Google login
const provider = new GoogleAuthProvider();
async function signInWithGoogle() {
  await signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user; 
    window.location.href = process.env.PUBLIC_URL + "/home";

  })
  .catch((error) => {
    const errorCode = error.code; 
    const errorMessage = error.message; 
    // const email = error.customData.email; 
    console.error(errorCode, errorMessage);
    const credential = GoogleAuthProvider.credentialFromError(error);
  })
}

// sign in status changes
onAuthStateChanged(auth, (user) => {
  if(user) {
    const uid = user.uid;
    gUser = user; 
  } else {
    console.log("user isn't signed in...");
  }
})


async function getCurrentUser() {
  if (gUser !== null) {
    return gUser;
  } else {
    return setTimeout(() => auth.currentUser, 200);
  }
}




export default { newUserSignInEmail, signInExisitingEmail, signInWithGoogle, getCurrentUser }