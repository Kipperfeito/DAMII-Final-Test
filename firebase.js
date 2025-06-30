// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRtZzyHLJvN3JvM2p-zsTYSqdW3R5zgBw",
  authDomain: "kidivinodamii.firebaseapp.com",
  projectId: "kidivinodamii",
  storageBucket: "kidivinodamii.firebasestorage.app",
  messagingSenderId: "978921164133",
  appId: "1:978921164133:web:7e59370c629b9987e0258c"
};

let app;
// Initialize Firebase
if (firebase.apps.length == 0) {
    app = firebase.initializeApp(firebaseConfig);
}
else app = firebase.app();

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export {auth, firestore, storage};