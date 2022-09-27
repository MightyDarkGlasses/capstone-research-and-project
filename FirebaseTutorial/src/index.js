//import firebase from 'firebase/app'  //ver8
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
    updateDoc        //update single document
} from 'firebase/firestore';


//Authentication
import {
    getAuth,
    createUserWithEmailAndPassword, //signup
    signOut, //signout the user
    signInWithEmailAndPassword, //signIn
    onAuthStateChanged  //state change
} from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyA5rA17z-ncVOEgiB3oO-wdGCYfq6VjKRs",
    authDomain: "fir-tutorial-54bcc.firebaseapp.com",
    projectId: "fir-tutorial-54bcc",
    storageBucket: "fir-tutorial-54bcc.appspot.com",
    messagingSenderId: "490596693746",
    appId: "1:490596693746:web:c49b30f3a819bc616cc26b"
};

//init firebase app
initializeApp(firebaseConfig)

// init service, Firestore is more concerned in Collections than JSON.
const db = getFirestore(); //anything we do in our DB, we use this
const auth = getAuth(); //utilize authentication service, (login, signup, signin)

// collection ref
const colRef = collection(db, 'books');

// get collection data
// getDocs(colRef) //JS Promises
//     .then((snapshot) => {
//         // console.log(snapshot.docs); //docs, represent the documents
//         let books = [];
//         snapshot.docs.forEach((doc) => {
//             books.push({ ...doc.data(), id: doc.id }); //... -> Spread, get all the data then the id
//         });
//         console.log(books); //print the book array

//         let output = "";
//         books.forEach((book) => {
//             output += `${book.id}, ${book.authors}, ${book.title}\n`; 
//         });
//         document.getElementById("output").innerText = output;
//     }).catch(err => {
//         console.log("Error: ", err);
//     }); //looks at the collection


// Firestore Queries
//where("element", "comparison op.", "findValue")
// const myQuery = query(colRef, 
//     where("authors", "==", "Rick Astley"),
//     orderBy("title", "desc")); //orderBy needs index, Check Firestore -> Indexes

const myQuery = query(colRef, 
    orderBy("createdAt")); //orderBy needs index, Check Firestore -> Indexes


// const myQuery = query(colRef, 
//     where("authors", "==", "Rick Astley"));
//the query will run the snapshot function

//real-time collection data
//onSnapshot(colRef, (snapshot) => { //no query
//onSnapshot(myQuery, (snapshot) => {     //based on the query, //change this back!
const unsubCollection = onSnapshot(myQuery, (snapshot) => {     //based on the query
    let books = [];
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id }); //... -> Spread, get all the data then the id
    });
    console.log(books); //print the book array

    let output = "";
    books.forEach((book) => {
        output += `${book.id}, ${book.authors}, ${book.title}\n`; 
    });
    document.getElementById("output").innerText = output;
});


// adding document
// adding docs
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault();   // because form automatically refreshes the page

  // addDoc(referenceObject, {values})
  addDoc(colRef, {
    title: addBookForm.title.value,    //name="title"
    authors: addBookForm.author.value,   //name="author"
    createdAt: serverTimestamp() //see the import
    //data will be logged two times, add then sort

  }).then(() => {
    document.getElementById("add").reset(); //reset the form, clear values
    console.log("Book was added in the collection");
  });
})

// deleting docs
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault(); // because form automatically refreshes the page

    //doc(database, collection, id)
    const docRef = doc(db, "books", deleteBookForm.id.value) //get document reference
    deleteDoc(docRef) //async so we have JS Promises
        .then(() => {
            deleteBookForm.reset(); //reset the form
        });
})


//get a single document
    const docRef = doc(db, "books", "TruxsFrPHW5dh8FIOZvT")
    //one-time listener
    // getDoc(docRef)
    //     .then((doc) => {
    //         console.log(doc.data(), doc.id);
    //     });

    //real-time listener
    //onSnapshot(docRef, (doc) => { //change this back!
    const unsubDocument = onSnapshot(docRef, (doc) => {
        console.log(doc.data(), doc.id);
        let output = `${doc.data()}, ${doc.id}`;
        document.getElementById("selected-output").innerText = output;
    });

//updating document
const updateForm = document.querySelector('.update');
updateForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const docRef = doc(db, "books", updateForm.id.value);

    updateDoc(docRef, {
        title: "Updated title.",    //I can use input later
        authors: "Updated authors"
    }).then(() => {
        updateForm.reset();
    });
})




//AUTHENTICATION
// Signing users (New user), automatically logged in after account creation
const signupForm = document.querySelector('.signup');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = signupForm.email.value;
    const password = signupForm.password.value;

    //auth -> getAuth(), email, password
    createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log('User created: ', cred.user);
            signupForm.reset(); //reset/clear form
        }).catch((err) => {
            console.log("Signup error message: ", err); //e.g password is wrong or too short, invalid email, etc.
        });
});

//Login and Logout
const logoutButton = document.querySelector('.logout');
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log("User signed out.")
        }).catch((err) => {
            console.log("Logout error message: ", err);
        }); //auth = getAuth();
});
const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = loginForm.email.value;    //check the name attr. name="email"
    const password = loginForm.password.value;
    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log("User logged in:", cred.user)
        }).catch((err) => {
            console.log("Sign in error: ", err);
        });
});


//Every then is async meaning it can update without refresh?


// Subscribing to auth changes
//onAuthStateChanged(auth, (user) => {
const unsubAuthentication = onAuthStateChanged(auth, (user) => {
    console.log("User state changed: ", user);
});


// Unsubscrib to db/auth changes
const unsubButton = document.querySelector(".unsub");
unsubButton.addEventListener('click', () => {
    console.log('unsubscribing');
    unsubCollection();
    unsubDocument();
    unsubAuthentication();
});