import { initializeApp } from 'firebase/app';
import { 
    getFirestore,
    collection,
    onSnapshot,   //setup realtime listener
    getDocs,      //get document 
    addDoc,       //add new document
    deleteDoc,    //delete document
    doc,          //making references

    query,      //Firestore queries, See line 62
    where,       //used by Firestore queries
    orderBy,      //used by Firestore queries, sorting data
    serverTimestamp,  //create timestamp stored in Firebase
    getDoc,          //grab single document
    updateDoc,        //update single document
    setDoc
} from 'firebase/firestore';

//Authentication
import {
    getAuth,
    createUserWithEmailAndPassword, //signup
    signOut, //signout the user
    signInWithEmailAndPassword, //signIn
    onAuthStateChanged,  //state change
    sendEmailVerification,
    updateProfile
} from 'firebase/auth';


import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } 
from "firebase/storage";


console.log("This is a test.")