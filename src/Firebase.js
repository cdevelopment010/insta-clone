// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
console.log(app);